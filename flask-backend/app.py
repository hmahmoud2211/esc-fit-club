from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token
from models import db, User, Product
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
app.config['JWT_SECRET_KEY'] = Config.SECRET_KEY
db.init_app(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})
migrate = Migrate(app, db)
jwt = JWTManager(app)

@app.route('/', methods=['GET'])
def root():
    """Return a friendly HTTP greeting."""
    return jsonify({"message": "Welcome to SO Web API", "status": "ok"})

@app.route('/api/health', methods=['GET'])
def health_check():
    """Check if the API is running."""
    return jsonify({"status": "ok"})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    if not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'msg': 'Missing required fields'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'msg': 'User already exists'}), 400
    user = User(name=data['name'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'Registration successful'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        token = create_access_token(identity=user.id)
        return jsonify({
            'msg': 'Login successful',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            },
            'token': token
        })
    return jsonify({'msg': 'Invalid credentials'}), 401

@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'stock': p.stock,
        'category': p.category,
        'images': p.images,
        'featured': p.featured
    } for p in products])

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.json
    product = Product(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        stock=data['stock'],
        category=data['category'],
        images=data['images'],
        featured=data.get('featured', False)
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({'msg': 'Product created', 'id': product.id}), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.json
    product = Product.query.get_or_404(product_id)
    for field in ['name', 'description', 'price', 'stock', 'category', 'images', 'featured']:
        if field in data:
            setattr(product, field, data[field])
    db.session.commit()
    return jsonify({'msg': 'Product updated'})

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'msg': 'Product deleted'})

if __name__ == '__main__':
    app.run(debug=True) 
//Requerimos el módulo fs para poder leer el archivo JSON
const fs = require('fs');
//Requerimos el módulo path para poder acceder a la ruta del archivo JSON
const path = require('path');

const {
    validationResult
} = require('express-validator');

//Obtenemos la ruta del archivo JSON
const productsFilePath = path.join(__dirname, '../data/products.json');

//Creamos un objeto literal que contendrá los métodos del controlador
const productsController = {
    //Método index que se encarga de obtener todos los productos y mostrarlos en la vista
    index: (req, res) => {
        //Leemos el archivo JSON
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        //Renderizamos la vista products y le pasamos la información de los productos
        res.render('products', { products });
    },
    //Método detail que se encarga de obtener el detalle de un producto y mostrarlo en la vista
    detail: (req, res) => {
        //Leemos el archivo JSON
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        //Obtenemos el id del producto que queremos mostrar
        const id = req.params.id;
        //Buscamos el producto que coincida con el id
        const product = products.find(product => product.id == id);
        //Renderizamos la vista productDetail y le pasamos la información del producto
        res.render('productDetail', { product });
    },
    create: (req, res) => {
        //Renderizamos la vista productCreate
        res.render('productCreate');
    },
    //Método store que se encarga de recibir los datos del formulario y crear un nuevo producto
    store: (req, res) => {
        //Leemos el archivo JSON
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        //Obtenemos los datos del formulario
        const data = req.body;
        //Creamos un nuevo producto
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            ...data,
            image: req.file ? req.file.filename : 'default-image.png'
        };
        //Validamos los datos del formulario
        const errors = validationResult(req);
        //Si hay errores, redirigimos al usuario al formulario de creación de productos con los errores
        if (!errors.isEmpty()) {
            return res.render('productCreate', {
                errors: errors.mapped(),
                oldData: req.body
            });
        }
        //Agregamos el nuevo producto al array de productos
        products.push(newProduct);
        //Escribimos el nuevo array de productos en el archivo JSON
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, ' '));
        //Redirigimos al usuario a la lista de productos
        res.redirect('/products');
    },
    edit: (req, res) => {
        //Leemos el archivo JSON
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        //Obtenemos el id del producto que queremos editar
        const id = req.params.id;
        //Buscamos el producto que queremos editar
        const product = products.find(product => product.id == id);
        //Renderizamos la vista productEdit
        res.render('productEdit', { product });
    },
    update: (req, res) => {
        //Leemos el archivo JSON
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        //Obtenemos el id del producto que queremos editar
        const id = req.params.id;
        //Buscamos el producto que queremos editar
        const product = products.find(product => product.id == id);
        //Actualizamos los datos del producto
        product.name = req.body.name;
        product.description = req.body.description;
        product.price = req.body.price;
        //Escribimos el nuevo array de productos en el archivo JSON
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, ' '));
        //Redirigimos al usuario a la lista de productos
        res.redirect('/products');
    },
    delete: (req, res) => {
        //Leemos el archivo JSON
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        //Obtenemos el id del producto que queremos eliminar
        const id = req.params.id;
        //Buscamos el producto que queremos eliminar
        const product = products.find(product => product.id == id);
        //Renderizamos la vista productDelete
        res.render('productDelete', { product });
    },
    destroy: (req, res) => {
        //Leemos el archivo JSON
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        //Obtenemos el id del producto que queremos eliminar
        const id = req.params.id;
        //Buscamos el producto que queremos eliminar
        const product = products.find(product => product.id == id);
        //Obtenemos el índice del producto que queremos eliminar
        const index = products.indexOf(product);
        //Eliminamos el producto del array
        products.splice(index, 1);
        //Escribimos el nuevo array de productos en el archivo JSON
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, ' '));
        //Redirigimos al usuario a la lista de productos
        res.redirect('/products');
    }
}

module.exports = productsController;
## Repaso express

### Creación del proyecto con express generator

1. Creamos una carpeta vacía con el nombre del proyecto
2. Abrimos esa carpeta en el Visual Studio Code
3. Abrimos una nueva terminal
4. En la terminal ejecutamos el siguiente comando para instalar express-generator de forma global según indica la documentación: https://www.npmjs.com/package/express-generator

<small>> terminal</small>
`npm install -g express-generator`

5. Una vez instalado, podemos usar el comando `express` para  crear un nuevo proyecto, pasándole el flag `--view=ejs` para indicarle el motor de vistas que usaremos

<small>> terminal</small>
`express --view=ejs`

7. Esto debería generar una serie de carpetas y archivos en nuestro proyecto, entre ellos un `package.json` con las dependencias que trae express generator por defecto. Procedemos a instalarlas:

<small>> terminal</small>
`npm install`

8. Debería crearse una nueva carpeta llamada `node_modules` con todas las dependencias que se instalaron dentro. Recordar que esta carpeta no se debe subir al repositorio así que se recomienda agregarla al `.gitignore`.
9. En el mismo archivo `package.json`encontraremos el script **start** ya creado, con lo cual lo ejecutamos para probar que nuestro proyecto se instaló correctamente
 
<small>> terminal</small>
`npm start`

10. Si abrimos nuestro navegador, en **localhost:3000** deberemos ver una pantalla de express dándonos la bienvenida, lo cual es la señal de que todo está bien.
11. Instalamos como dependencia de desarrollo y configuramos **nodemon** https://www.npmjs.com/package/nodemon para que al realizar cualquier cambio, el servidor se reinicie. 

<small>> terminal</small>
`npm i nodemon -D`

<small>> package.json</small>
<pre><code>"scripts": {
	"start": "node ./bin/www"
},</code></pre>

<small>Lo cambiamos por</small>
<pre><code>"scripts": {
	"start": "nodemon ./bin/www"
},</code></pre>

### Implementación de arquitectura MVC

> Recordemos que la arquitectura MVC es una forma de organizar el código de nuestra aplicación, separando la lógica de negocio de la lógica de presentación. En el caso de express, la lógica de negocio se encuentra en los controladores y la lógica de presentación en las vistas.

1. Creamos una carpeta llamada `controllers` en la raíz del proyecto y dentro de ella creamos un archivo llamado `mainController.js` que contendrá la lógica de nuestro controlador principal.

<small>> controllers/mainController.js</small>

<pre><code>const mainController = {
	index: (req, res) => {
		res.render('index', { title: 'Express' });
	}
}

module.exports = mainController;</code></pre>

> Los controladores son objetos literales que contienen métodos que se encargan de manejar las peticiones que llegan a nuestro servidor. En este caso, el método `index` es el encargado de manejar la petición `GET` a la ruta `/`. Este método recibe dos parámetros, `req` y `res`, que son los objetos que nos permiten acceder a la información de la petición y a la información de la respuesta, respectivamente. En este caso, el método `render` de `res` es el encargado de renderizar la vista `index` y pasarle como parámetro un objeto con la información que queremos mostrar en la vista.

2. Modificamos la ruta `GET /` en `routes/index.js` para que apunte al controlador `mainController` y al método `index` que acabamos de crear.

<small>> routes/index.js</small>

<pre><code>const express = require('express');
const router = express.Router();

//Requerimos el controlador
const mainController = require('../controllers/mainController');

router.get('/', mainController.index);

module.exports = router;</code></pre>

> Para crear rutas en express, utilizamos el método `Router` de express, que nos devuelve un objeto literal que nos permite crear rutas. En este caso, creamos una ruta `GET /` que apunta al controlador `mainController` y al método `index`. Para poder utilizar el controlador, lo requerimos en la primera línea del archivo. Recordar que en todas las rutas debemos exportar el objeto `router` para poder utilizarlo en el archivo `app.js`.

3. Verificamos que en el archivo `app.js` se encuentre configurado el uso de las rutas que acabamos de crear. En caso de no estarlo, debemos agregar la siguiente línea de código:

<small>> app.js</small>

<pre><code>const indexRouter = require('./routes/index');</code></pre>

<small>Y debajo de la línea que dice `app.use(express.json());` agregar la siguiente:</small>

<pre><code>app.use('/', indexRouter);</code></pre>

> En este caso, estamos indicando que todas las rutas que comiencen con `/` serán manejadas por el archivo `index.js` que se encuentra en la carpeta `routes`.

### CRUD de productos

> En este punto, ya tenemos configurada la arquitectura MVC y podemos comenzar a trabajar en el CRUD de productos. Para ello, vamos a crear un archivo JSON que contendrá la información de los productos que vamos a mostrar en nuestra página.

1. Creamos un archivo llamado `products.json` en la carpeta `data` con el siguiente contenido:

<small>> data/products.json</small>

<pre><code>[
    {
        "id": 1,
        "name": "Producto 1",
        "description": "Descripción del producto 1",
        "price": 100,
        "image": "default-image.png"
    },
    {
        "id": 2,
        "name": "Producto 2",
        "description": "Descripción del producto 2",
        "price": 200,
        "image": "default-image.png"
    },
    {
        "id": 3,
        "name": "Producto 3",
        "description": "Descripción del producto 3",
        "price": 300,
        "image": "default-image.png"
    }
]</code></pre>

2. Creamos un controlador llamado `productsController.js` en la carpeta `controllers` con el siguiente contenido:

<small>> controllers/productsController.js</small>

<pre><code>
//Requerimos el módulo fs para poder leer el archivo JSON
const fs = require('fs');
//Requerimos el módulo path para poder acceder a la ruta del archivo JSON
const path = require('path');

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
    }
}

module.exports = productsController;</code></pre>

> pssst... acordate que `{ products }` es lo mismo que `{ products: products }`

3. Ahora vamos a crear la ruta `GET /products` en el archivo `routes/products.js` con el siguiente contenido:

<small>> routes/products.js</small>

<pre><code>
const express = require('express');
const router = express.Router();

//Requerimos el controlador
const productsController = require('../controllers/productsController');

//Creamos la ruta GET /products que apunta al método index del controlador productsController
router.get('/', productsController.index);

module.exports = router;</code></pre>

4. Por último, vamos a agregar la ruta `GET /products` en el archivo `app.js` con el siguiente contenido:

<small>> app.js</small>

<pre><code>
const productsRouter = require('./routes/products');

//...

app.use('/products', productsRouter);</code></pre>

> En este caso, estamos indicando que todas las rutas que comiencen con `/products` serán manejadas por el archivo `products.js` que se encuentra en la carpeta `routes`.

5. Creamos la vista `products.ejs` en la carpeta `views` con el siguiente contenido:

<small>> views/products.ejs</small>

<pre><code>
&lt;h1&gt;Listado de productos&lt;/h1&gt;

&lt;% for (let i = 0; i < products.length; i++) { %&gt;
    &lt;div&gt;
        &lt;h2&gt;&lt;%= products[i].name %&gt;&lt;/h2&gt;
        &lt;p&gt;&lt;%= products[i].description %&gt;&lt;/p&gt;
        &lt;p&gt;&lt;%= products[i].price %&gt;&lt;/p&gt;
        &lt;img src="images/&lt;%= products[i].image %&gt;" alt="&lt;%= products[i].name %&gt;"&gt;

        &lt;a href="/products/&lt;%= products[i].id %&gt;"&gt;Ver detalle&lt;/a&gt;
        &lt;a href="/products/&lt;%= products[i].id %&gt;/edit"&gt;Editar&lt;/a&gt;
        &lt;a href="/products/&lt;%= products[i].id %&gt;/delete"&gt;Eliminar&lt;/a&gt;

    &lt;/div&gt;
&lt;% } %&gt;

&lt;a href="/products/create"&gt;Crear producto&lt;/a&gt;</code></pre>

</code></pre>


6. Verificamos que todo esté funcionando correctamente. Para ello, iniciamos el servidor con el comando `npm start` y abrimos el navegador en la ruta `http://localhost:3000/products`. Podemos guardar una imagen en la carpeta `public/images` y modificar el archivo `products.json` para que apunte a esa imagen, como así también agregar estilos a la vista `products.ejs` para que se vea más lindo.

7. Como habrás notado, en la vista `products.ejs` estamos mostrando un link para ver el detalle de cada producto, pero todavía no tenemos la ruta `GET /products/:id` para poder mostrar el detalle de cada producto. Para ello, vamos a crear la ruta `GET /products/:id` en el archivo `routes/products.js` con el siguiente contenido:

<small>> routes/products.js</small>

<pre><code>
//...

//Creamos la ruta GET /products/:id que apunta al método detail del controlador productsController

router.get('/:id', productsController.detail);
</code></pre>

8. Ahora vamos a crear el método `detail` en el archivo `controllers/productsController.js` con el siguiente contenido:

<small>> controllers/productsController.js</small>

<pre><code>
//...

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
}
</code></pre>

9. Por último, vamos a crear la vista `productDetail.ejs` en la carpeta `views` con el siguiente contenido:

<small>> views/productDetail.ejs</small>

<pre><code>
&lt;h1&gt;Detalle del producto&lt;/h1&gt;

&lt;div&gt;
    &lt;h2&gt;&lt;%= product.name %&gt;&lt;/h2&gt;
    &lt;p&gt;&lt;%= product.description %&gt;&lt;/p&gt;
    &lt;p&gt;&lt;%= product.price %&gt;&lt;/p&gt;
    &lt;img src="images/&lt;%= product.image %&gt;" alt="&lt;%= product.name %&gt;"&gt;
&lt;/div&gt;
</code></pre>

10. Volvemos a verificar que todo esté funcionando correctamente, ingresando a la ruta `http://localhost:3000/products/1` (o cualquier otro id de producto que tengamos en el archivo `products.json`).

11. Ahora vamos a crear la ruta `GET /products/create` en el archivo `routes/products.js` para poder mostrar el formulario de creación de productos:

> Por orden de prioridad, es importante crear esta ruta antes de la ruta `GET /products/:id` ya que sino, la ruta `GET /products/:id` siempre va a coincidir con la ruta `GET /products/create` y nunca va a llegar a la ruta `GET /products/:id`.

<small>> routes/products.js</small>

<pre><code>

//Creamos la ruta GET /products/create que apunta al método create del controlador productsController

router.get('/create', productsController.create);
</code></pre>

12. Ahora vamos a crear el método `create` en el archivo `controllers/productsController.js` con el siguiente contenido:

<small>> controllers/productsController.js</small>

<pre><code>
//...

//Método create que se encarga de mostrar el formulario de creación de productos

create: (req, res) => {
    //Renderizamos la vista productCreate
    res.render('productCreate');
}

</code></pre>

13. Por último, vamos a crear la vista `productCreate.ejs` en la carpeta `views` con el siguiente contenido:

<small>> views/productCreate.ejs</small>

<pre><code>

&lt;h1&gt;Crear producto&lt;/h1&gt;

&lt;form action="/products" method="POST"&gt;
    &lt;label for="name"&gt;Nombre:&lt;/label&gt;
    &lt;input type="text" name="name" id="name"&gt;

    &lt;label for="description"&gt;Descripción:&lt;/label&gt;
    &lt;input type="text" name="description" id="description"&gt;

    &lt;label for="price"&gt;Precio:&lt;/label&gt;
    &lt;input type="number" name="price" id="price"&gt;

    &lt;button type="submit"&gt;Crear&lt;/button&gt;

&lt;/form&gt;
</code></pre>

14. Ahora tenemos un formulario que envía los datos a la ruta `POST /products`, pero todavía no tenemos esa ruta. Para crearla, vamos a agregar la siguiente ruta en el archivo `routes/products.js`:

<small>> routes/products.js</small>

<pre><code>
//...

//Creamos la ruta POST /products que apunta al método store del controlador productsController

router.post('/', productsController.store);
</code></pre>

15. Ahora vamos a crear el método `store` en el archivo `controllers/productsController.js` con el siguiente contenido:

<small>> controllers/productsController.js</small>

<pre><code>
//...

//Método store que se encarga de recibir los datos del formulario y crear un nuevo producto

store: (req, res) => {
    //Leemos el archivo JSON
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    //Obtenemos los datos del formulario
    const product = req.body;
    //Generamos un id para el nuevo producto esto se puede hacer de muchas formas, pero es importante que sea único para cada producto
    product.id = Math.random().toString(36).substr(2, 9);
    //Agregamos el nuevo producto al array de productos
    products.push(product);
    //Escribimos el nuevo array de productos en el archivo JSON
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, ' '));
    //Redirigimos al usuario a la lista de productos
    res.redirect('/products');
}

</code></pre>

16. Ahora vamos a verificar que todo esté funcionando correctamente, ingresando a la ruta `http://localhost:3000/products/create` y creando un nuevo producto. Si funcionó, felicitaciones! Ya tenemos el proceso de creación de productos.

17. Ahora vamos a crear la ruta `GET /products/:id/edit` en el archivo `routes/products.js` para poder mostrar el formulario de edición de productos:

<small>> routes/products.js</small>

<pre><code>

//Creamos la ruta GET /products/:id/edit que apunta al método edit del controlador productsController

router.get('/:id/edit', productsController.edit);

</code></pre>

18. Ahora vamos a crear el método `edit` en el archivo `controllers/productsController.js` con el siguiente contenido:

<small>> controllers/productsController.js</small>

<pre><code>
//...

//Método edit que se encarga de mostrar el formulario de edición de productos

edit: (req, res) => {
    //Leemos el archivo JSON
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    //Obtenemos el id del producto que queremos editar
    const id = req.params.id;
    //Buscamos el producto que queremos editar
    const product = products.find(product => product.id == id);
    //Renderizamos la vista productEdit
    res.render('productEdit', { product });
}

</code></pre>

19. Por último, vamos a crear la vista `productEdit.ejs` en la carpeta `views` con el siguiente contenido:

> Nota: En el formulario, vamos a utilizar el atributo `value` para mostrar los datos del producto que queremos editar.

> Nota: En el formulario, vamos a utilizar el atributo `action` para indicarle a la ruta `PUT /products/:id` que queremos editar el producto con el id que viene en la URL.

> Nota: En el formulario, vamos a utilizar el atributo `method` para indicarle a la ruta `PUT /products/:id` que queremos editar el producto con el id que viene en la URL. Como estamos utilizando el método `PUT`, vamos a tener que instalar el paquete `method-override` https://www.npmjs.com/package/method-override y agregarlo en el archivo `app.js`:

<small>> terminal</small>

<pre><code>
npm install method-override
</code></pre>

<small>> app.js</small>

<pre><code>
//...

//Importamos el paquete method-override

const methodOverride = require('method-override');

//...

//Configuramos el paquete method-override

app.use(methodOverride('_method'));

</code></pre>

20. Ahora si, podemos crear la vista `productEdit.ejs` en la carpeta `views` con el siguiente contenido:

<small>> views/productEdit.ejs</small>

<pre><code>

&lt;h1&gt;Editar producto&lt;/h1&gt;

&lt;form action="/products/&lt;%= product.id %>?_method=PUT" method="POST"&gt;

    &lt;label for="name"&gt;Nombre:&lt;/label&gt;
    &lt;input type="text" name="name" id="name" value="&lt;%= product.name %>"&gt;

    &lt;label for="description"&gt;Descripción:&lt;/label&gt;
    &lt;input type="text" name="description" id="description" value="&lt;%= product.description %>"&gt;

    &lt;label for="price"&gt;Precio:&lt;/label&gt;
    &lt;input type="number" name="price" id="price" value="&lt;%= product.price %>"&gt;

    &lt;button type="submit"&gt;Editar&lt;/button&gt;

&lt;/form&gt;

</code></pre>

21. Ahora vamos a crear la ruta `PUT /products/:id` en el archivo `routes/products.js` para poder editar un producto:

<small>> routes/products.js</small>

<pre><code>

//Creamos la ruta PUT /products/:id que apunta al método update del controlador productsController

router.put('/:id', productsController.update);

</code></pre>

22. Ahora vamos a crear el método `update` en el archivo `controllers/productsController.js` con el siguiente contenido:

<small>> controllers/productsController.js</small>

<pre><code>
//...

//Método update que se encarga de editar un producto

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
}

</code></pre>

23. Por último, vamos a crear la ruta `GET /products/:id/delete` en el archivo `routes/products.js` para poder eliminar un producto:

<small>> routes/products.js</small>

<pre><code>

//Creamos la ruta GET /products/:id/delete que apunta al método destroy del controlador productsController

router.get('/:id/delete', productsController.delete);

</code></pre>

24. Ahora vamos a crear el método `delete` en el archivo `controllers/productsController.js` con el siguiente contenido:

<small>> controllers/productsController.js</small>

<pre><code>

//...

//Método delete que se encarga de mostrar el formulario de eliminación de productos

delete: (req, res) => {
    //Leemos el archivo JSON
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    //Obtenemos el id del producto que queremos eliminar
    const id = req.params.id;
    //Buscamos el producto que queremos eliminar
    const product = products.find(product => product.id == id);
    //Renderizamos la vista productDelete
    res.render('productDelete', { product });
}

</code></pre>

25. Por último, vamos a crear la vista `productDelete.ejs` en la carpeta `views` con el siguiente contenido:

<small>> views/productDelete.ejs</small>

<pre><code>

&lt;h1&gt;Estás seguro que querés eliminar el producto &lt;%= product.name %>&lt;/h1&gt;

&lt;form action="/products/&lt;%= product.id %>?_method=DELETE" method="POST"&gt;

    &lt;button type="submit"&gt;Eliminar&lt;/button&gt;

&lt;/form&gt;

</code></pre>

26. Ahora vamos a crear la ruta `DELETE /products/:id` en el archivo `routes/products.js` para poder eliminar un producto:

<small>> routes/products.js</small>

<pre><code>

//Creamos la ruta DELETE /products/:id que apunta al método destroy del controlador productsController

router.delete('/:id', productsController.destroy);

</code></pre>

27. Ahora vamos a crear el método `destroy` en el archivo `controllers/productsController.js` con el siguiente contenido:

<small>> controllers/productsController.js</small>

<pre><code>

//...

//Método destroy que se encarga de eliminar un producto

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

</code></pre>

### Middlewares

> Los middlewares son funciones que se ejecutan antes de que se procese una petición. Nos permiten realizar acciones comunes a todas las rutas, como por ejemplo, validar que el usuario esté logueado o para rutas particulares, como por ejemplo, validar que el usuario que está editando un producto sea el dueño del mismo.

1. Vamos a crear un middleware que funcione en todas las rutas y que, simplemente nos muestre un mensaje en la consola cada vez que se haga una petición a nuestro servidor, para esto vamos a crear una carpeta `middlewares` en la raíz del proyecto y dentro de ella un archivo `logMiddleware.js` con el siguiente contenido:

<small>> middlewares/logMiddleware.js</small>

<pre><code>

module.exports = (req, res, next) => {
    console.log('Se hizo una petición a ' + req.url);
    next();
}

</code></pre>

2. Ahora vamos a importar el middleware en el archivo `app.js` y usarlo en todas las rutas:

<small>> app.js</small>

<pre><code>

//...

//Importamos el middleware logMiddleware

const logMiddleware = require('./middlewares/logMiddleware');

//...

//Usamos el middleware logMiddleware en todas las rutas

app.use(logMiddleware);

</code></pre>

3. Probemos que el middleware funciona, para esto vamos a reiniciar el servidor y hacer una petición a la ruta `GET /products`, si todo salió bien, deberíamos ver el mensaje `Se hizo una petición a /products` en la consola.

> Puede ocurrir que en lugar de /products, veamos /worker.js, no te preocupes, esto es normal.

4. Ahora vamos a crear un middleware que se encarge de validar los datos del formulario de creación de productos, para esto vamos a crear un archivo `productsMiddleware.js` en la carpeta `middlewares`. Para esto, primero debemos instalar la librería `express-validator` https://www.npmjs.com/package/express-validator con el siguiente comando:

<small>> Terminal</small>

<pre><code>
npm install express-validator
</code></pre>

Y luego, vamos a crear el archivo `productsMiddleware.js` con el siguiente contenido:

<small>> middlewares/productsMiddleware.js</small>

<pre><code>

const { check } = require('express-validator');

//Solo valido el nombre y el precio, ya que el resto de los campos son opcionales

const productCreateValidator = [
    check('name')
        .notEmpty().withMessage('Debes ingresar un nombre').bail()
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres'),
    check('price')
        .notEmpty().withMessage('Debes ingresar un precio').bail()
        .isInt({ min: 1 }).withMessage('El precio debe ser un número entero mayor a 0')
];

module.exports = productCreateValidator;

</code></pre>

5. Ahora vamos a importar el middleware en el archivo `routes/products.js` y usarlo en la ruta `POST /products`:

<small>> routes/products.js</small>

<pre><code>

//...

//Importamos el middleware productCreateValidator

const productCreateValidator = require('../middlewares/productsMiddleware');

//...

//Usamos el middleware productCreateValidator en la ruta POST /products

router.post('/', productCreateValidator, productsController.store);

</code></pre>

6. Ahora vamos a modificar el método `store` del archivo `controllers/productsController.js` para que valide los datos del formulario y en caso de que haya errores, redirija al usuario al formulario de creación de productos con los errores:

<small>> controllers/productsController.js</small>

<pre><code>

const {
    validationResult
} = require('express-validator');

//...

//Método store que se encarga de guardar un producto

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
}

//...

</code></pre>

7. Ahora vamos a modificar el archivo `views/products/create.ejs` para que muestre los errores de validación, para esto vamos a agregar el siguiente código en el formulario:

<small>> views/products/create.ejs</small>

<pre><code>

//...

<% if(locals?.errors) { %>
    <div class="alert alert-danger" role="alert">
        <ul>
            <% if(errors.name) { %>
                <li><%= errors.name.msg %></li>
            <% } %>
            <% if(errors.price) { %>
                <li><%= errors.price.msg %></li>
            <% } %>
        </ul>
    </div>
<% } %>

</code></pre>

### Multer

> Multer es un middleware de Node.js para manejar archivos subidos. Es escrito en TypeScript y agrega un objeto body o file a la solicitud y un objeto file o files al objeto de respuesta. El objeto file o files contiene información sobre los archivos subidos, y los campos de body contiene los valores de los campos de entrada del formulario, los cuales se obtienen mediante el objeto de solicitud req.body.

1. Vamos a instalar la librería `multer` https://www.npmjs.com/package/multer con el siguiente comando:

<small>> Terminal</small>

<pre><code>
npm install multer
</code></pre>









































let productsList = document.getElementById("productInfo");
const url = 'https://world.openfoodfacts.org/api/v0/product/';


function clearInput(inputItem) {
	inputItem.value = "";
}

function searchBarCode(url) {
	//Creo la variable que almacenara los elementos donde estaré escuchando el click
	let searchClick = document.getElementById("buttonSearch");
	if(searchClick != undefined){
		// Escuchamos el evento del botón buscar
		searchClick.addEventListener("click", function () {
			let inputBarCode = document.getElementById("inputText");
			let inputValueSend = inputBarCode.value;
			clearInput(inputBarCode);
			//Llamamos a la función buildLaunch y le pasamos los parametros que vamos a necesitar
			bringProductInfo(url, inputValueSend);
		});	
	}
}

searchBarCode(url)


function clearList(productsList) {
	productsList.innerHTML = "";
}

function writeProductInfo(productsList, product) {
	if (product.status_verbose == "product found" && product.code != null) {
		// NUTRISCORE, A,B,C,D,E
		const nutriscore = {};
		nutriscore.value = product.product.nutrition_grades;
		if (nutriscore.value == 'a' || nutriscore.value == 'A') {
			nutriscore.src = 'img/nutriscore-a.svg';
		}
		if (nutriscore.value == 'b' || nutriscore.value == 'B') {
			nutriscore.src = 'img/nutriscore-b.svg';
		}
		if (nutriscore.value == 'c' || nutriscore.value == 'C') {
			nutriscore.src = 'img/nutriscore-c.svg';
		}
		if (nutriscore.value == 'd' || nutriscore.value == 'D') {
			nutriscore.src = 'img/nutriscore-d.svg';
		}
		if (nutriscore.value == 'e' || nutriscore.value == 'E') {
			nutriscore.src = 'img/nutriscore-e.svg';
		}

		//Limitar los decimales del sodio
		let sodioValue = product.product.nutriments.sodium_100g;
		if (typeof sodioValue != "undefined"){
			sodioValue = sodioValue.toFixed(3);
		}

		let modalEnterBarcode = document.getElementById("modalEnterBarcode");

		productsList.innerHTML = `
		<h2>${product.product.product_name}</h2>
		<ul class="gallery">
			<li><img src="${product.product.image_url}"></p></li>
		</ul>	
		<ul class="productProperties">
			<li><p><span class="title">Marca:</span><span class="description">${product.product.brands}</span></p></li>
			<li><p><span class="title">Nombre del producto:</span><span class="description">${product.product.product_name}</span></p></li>
			<li><p><span class="title">Código de barras:</span><span class="description">${product.product.code}</span></p></li>
			<li><p><span class="title">Categoria:</span><span class="description">${product.product.categories}</span></p></li>
			<li><p><span class="title">País de procedencia:</span><span class="description">${product.product.countries}</span></p></li>
			<li><p><span class="title">Ingredientes:</span><span class="description">${product.product.ingredients_text}</span></p></li>
			<li><p><span class="title">Alérgenos:</span><span class="description">${product.product.allergens}</span></p></li>
			<li><p><span class="title">Nivel de grasa:</span><span class="description">${product.product.nutrient_levels.fat}</span></p></li>
			<li><p><span class="title">Nivel de sal:</span><span class="description">${product.product.nutrient_levels.salt}</span></p></li>
			<li><p><span class="title">Nivel de azúcares:</span><span class="description">${product.product.nutrient_levels.sugars}</span></p></li>
			<li><p><span class="title">Posibles trazas de:</span><span class="description">${product.product.traces}</span></p></li>
			<li><p><span class="title">Última actualización:</span><span class="description">${product.product.last_edit_dates_tags[2]}</span></p></li>
			<li><p><span class="title">Envase:</span><span class="description">${product.product.packaging}</span></p></li>
			<li><p><span class="title">Peso:</span><span class="description">${product.product.quantity}</span></p></li>
			<li><p><span class="title">Lugar de fabricación:</span><span class="description">${product.product.manufacturing_places}</span></p></li>
			<li><p><span class="title">Nutriscore:</span><span class="description"><img src="${nutriscore.src}" alt="${product.product.brands}"></span></p></li>
		</ul>		
		<table class="table table-bordered">
			<thead>
				<tr>
					<th>Valor Nutricional</th>
					<th>100g</th>
				</tr>
			</thead>
			<tbody>
					<tr>
						<td>Valor Energético</td>
						<td>${product.product.nutriments.energy_100g}</td>
					</tr>
					<tr>
						<td>Carbohidratos</td>
						<td>${product.product.nutriments.carbohydrates_100g}</td>
					</tr>
					<tr>
						<td>Grasas</td>
						<td>${product.product.nutriments.fat_100g}</td>
					</tr>
					<tr>
						<td>Fibra</td>
						<td>${product.product.nutriments.fiber_100g}</td>
					</tr>
					<tr>
						<td>Proteinas</td>
						<td>${product.product.nutriments.proteins_100g}</td>
					</tr>
					<tr>
						<td>Sal</td>
						<td>${product.product.nutriments.salt_100g}</td>
					</tr>
					<tr>
						<td>Grasas Saturadas</td>
						<td>${product.product.nutriments.fat_100g}</td>
					</tr>
					<tr>
						<td>Sodio</td>
						<td>${sodioValue}</td>
					</tr>
					<tr>
						<td>Azucares</td>
						<td>${product.product.nutriments.sugars_100g}</td>
					</tr>
			</tbody>
		</table>
		`;
		
	}
	else {
		productsList.innerHTML = `
			<h4 class="error"><span class="title">!</span><br/><br/>¡Ups! No se ha encontrado el producto relacionado con este código de barras en nuestra base de datos. Prueba a reescribirlo o introducir otro.</h4>
		`;
	}

}

async function bringProductInfo(url, barCode) {
	// Lo primero juntamos la url de la api con el código de barras introducido y la extensión .json
	let urlWithBarCode = url + barCode + '.json';
	// Con fetch hacemos una llamada a la api deseada
	let firstData = await fetch(urlWithBarCode);
	// Almacenamos en contenido recibido por la API, como un JSON (tipo objeto)
	let data = await firstData.json();
	console.log(data);
	//Vaciamos el contenido del elemento UL donde se va a pintar el contenido
	clearList(productsList);
	//Llamamos a la función que va a escribir la información recibida.
	writeProductInfo(productsList, data);
}


$(function () {
	const openMenu = document.getElementById("js-menu-open");
	const closeMenu = document.getElementById("js-close-menu");
	const menuLeft = document.getElementById("menuLeft"); 
	openMenu.addEventListener("click", function () {
		menuLeft.style.left = "0px";
	});
	closeMenu.addEventListener("click", function () {
		menuLeft.style.left = "-100%";
	});
	// Create the QuaggaJS config object for the live stream
	var liveStreamConfig = {
		inputStream: {
			type: "LiveStream",
			constraints: {
				aspectRatio: { min: 1, max: 100 },
				facingMode: "environment" // or "user" for the front camera
			}
		},
		locator: {
			patchSize: "medium",
			halfSample: true
		},
		numOfWorkers: (navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4),
		decoder: {
			"readers": [
				{ "format": "ean_reader", "config": {} }
			]
		},
		locate: true
	};
	// The fallback to the file API requires a different inputStream option. 
	// The rest is the same 
	var fileConfig = $.extend(
		{},
		liveStreamConfig,
		{
			inputStream: {
				size: 800
			}
		}
	);
	// Start the live stream scanner when the modal opens
	$('#livestream_scanner').on('shown.bs.modal', function (e) {
		Quagga.init(
			liveStreamConfig,
			function (err) {
				if (err) {
					$('#livestream_scanner .modal-body .error').html('<div class="alert alert-danger"><span class="title"><i class="fa fa-exclamation-triangle"></i> ' + err.name + '</span>: ' + err.message + '</div>');
					Quagga.stop();
					return;
				}
				Quagga.start();
			}
		);
	});

	// Make sure, QuaggaJS draws frames an lines around possible 
	// barcodes on the live stream
	Quagga.onProcessed(function (result) {
		var drawingCtx = Quagga.canvas.ctx.overlay,
			drawingCanvas = Quagga.canvas.dom.overlay;

		if (result) {
			if (result.boxes) {
				drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
				result.boxes.filter(function (box) {
					return box !== result.box;
				}).forEach(function (box) {
					Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
				});
			}

			if (result.box) {
				Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
			}

			if (result.codeResult && result.codeResult.code) {
				Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
			}
		}
	});

	// Once a barcode had been read successfully, stop quagga and 
	// close the modal after a second to let the user notice where 
	// the barcode had actually been found.
	Quagga.onDetected(function (result) {
		if (result.codeResult.code) {
			$('#inputText').val(result.codeResult.code);
			Quagga.stop();
			setTimeout(function () { $('#livestream_scanner').modal('hide'); }, 1000);
			document.getElementById('buttonSearch').click();
		}
	});

	// Stop quagga in any case, when the modal is closed
	$('#livestream_scanner').on('hide.bs.modal', function () {
		if (Quagga) {
			Quagga.stop();
		}
	});

	// Call Quagga.decodeSingle() for every file selected in the 
	// file input
	$("#livestream_scanner input:file").on("change", function (e) {
		if (e.target.files && e.target.files.length) {
			Quagga.decodeSingle($.extend({}, fileConfig, { src: URL.createObjectURL(e.target.files[0]) }), function (result) { alert(result.codeResult.code); });
		}
	});
});
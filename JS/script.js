const containerInfo = document.getElementById('container-info');
const criptomonedasSelect = document.getElementById('criptomoneda');
const moneda = document.getElementById('moneda');
const formulario = document.getElementById('formulario');
const containerResultado = document.getElementById('resultado');

const objBusqueda = {
	moneda: '',
	criptomoneda: ''
}

// Creamos un Promise
const obtenerCriptomonedas = criptomonedas => new Promise (resolve => {
	resolve(criptomonedas);
});

window.addEventListener('load', () => {
	consultarCriptomoneda();

	formulario.addEventListener('submit', submitFormulario);

	criptomonedasSelect.addEventListener('change', leerValor);
	moneda.addEventListener('change', leerValor);
});

function consultarCriptomoneda(){
	const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

	fetch(url)
		.then(respuesta => respuesta.json())
		// obtenerCriptomonedas es un promise 
		.then(resultado =>  obtenerCriptomonedas(resultado.Data))
		// El .then de abajo es relacionado al Promise de obtenerCriptomonedas
		.then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas){
	criptomonedas.forEach(cripto => {
		const {FullName, Name} = cripto.CoinInfo;

		const option = document.createElement('option');
		option.value = Name;
		option.textContent = FullName;
		criptomonedasSelect.appendChild(option);
	});
}

function leerValor(e){
	// Hay relación con el name en los "select", atento a eso
	objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e){
	e.preventDefault();

	// Validar
	const {moneda, criptomoneda} = objBusqueda;

	if(moneda === '' || criptomoneda === ''){
		mostrarAlerta('¡Ambos campos son obligatorios!');
		return;
	}
	consultarAPI();
}


function mostrarAlerta(mensaje){
	const error = document.querySelector('.error')
	if(!error){
		const alert = document.createElement('p');
		alert.classList.add('error');
		alert.textContent = mensaje;
		containerInfo.appendChild(alert);

		setTimeout(() => {
			alert.remove();
		}, 2500);
	}
}

function consultarAPI(){
	// Obtenemos los datos
	const {moneda, criptomoneda} = objBusqueda;
	const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

	// Lo ponemos aquí antes que vaya a consultar!
	Spinner();

	fetch(url)
	.then(respuesta => respuesta.json())
	.then(cotización => {
		mostrarCotizacionHTML(cotización.DISPLAY[criptomoneda][moneda]);
	})
}

function mostrarCotizacionHTML(cotización){
	limpiarHTML();
	
	const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotización;

	const precio = document.createElement('p');
	precio.classList.add('precio');
	precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

	// Precio alto
	const precioAlto = document.createElement('p');
	precioAlto.classList.add('precio');
	precioAlto.innerHTML= `<p>Precio más alto del día: <span>${HIGHDAY}</span></p>`

	// Precio más bajo
	const precioBajo = document.createElement('p');
	precioBajo.classList.add('precio');
	precioBajo.innerHTML= `<p>Precio más bajo del día: <span>${LOWDAY}</span></p>`

	// Variaciones
	const variacion = document.createElement('p');
	variacion.classList.add('precio');
	variacion.innerHTML= `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`

	containerResultado.appendChild(precio);
	containerResultado.appendChild(precioAlto);
	containerResultado.appendChild(precioBajo);
	containerResultado.appendChild(variacion);
}

function limpiarHTML(){
	while(containerResultado.firstChild){
		containerResultado.removeChild(containerResultado.firstChild)
	}
}

function Spinner(){
	limpiarHTML();
	const spinner = document.createElement('div');
	spinner.classList.add('spinner');
	spinner.innerHTML= `<div class="bounce1"></div>
		<div class="bounce2"></div>
		<div class="bounce3"></div>
	`;

	containerResultado.appendChild(spinner);
}
'use strict';
/*****************************************************
******											******										
					OPCIONES						
	1.- gulp download (seleccion del layout)
	2.- gulp sourcejs (solo para componentes)
	3.- gulp jsfull (concatenado y minificado todo)
	4.- gulp styles-css (compilado scss y escucha)
	5.- gulp styles-min (compilado y minificado todo)
	6.- gulp jade-comp (compilado jade)
	7.- gulp cjj (compilar styles-css, jade-comp, sourcejs)
	8.- gulp cjj-min (compilar styles-css, jade-comp, jsfull minificado)
	9.- gulp css-jade (compilar styles-css y jade-comp)
	10.- gulp css-js (compilar styles-css y sourcejs)
	11.- gulp jade-js (compilar jade-comp y sourcejs)
	12.- gulp css (compilar solo css minificado con escucha)
	13.- gulp jade (ompilar solo jade con escucha)
	14.- gulp js (compilar solo js minificado con escucha)
	15.- gulp prod (compilar todo para exportar, no terminado)
	16.- gulp layout (añadir una nueva plantilla a nuestro tema, copiado del repositorio)
	17.- gulp component (añadir un nuevo componente)
******											******
*****************************************************/

/*
*	Dependecias
*/
var gulp = require('gulp'),
	argv = require('yargs').argv,
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyes'),
	sass = require('gulp-sass'),
	minifyCss = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer'),
	gcmq = require('gulp-group-css-media-queries'),
	jade = require('gulp-jade'),
	rename = require('gulp-rename'),
	watch = require('gulp-watch'),
	prompt = require('gulp-prompt'),
	glob = require('glob-all'),
	browserSync = require('browser-sync').create(),
	reload      = browserSync.reload;

gulp.task('default', function(){
	gulp.src('*')
		.pipe(prompt.prompt({
			type: 'input',
			name: 'update',
			message: '\n¿Has actualizado el package.json (ncu -ua)? [Y/N]\n'
		}, function(res){
		
			if(res.update== 'N' || res.update== 'n'){
				console.log('Ejecuta ncu -ua.\nPara que te funcione, tienes que tener instalado npm-check-updates de forma global\n(npm install npm-check-updates -g) \nDespués debes volver a ejecutar npm install para que se actualicen los módulos');
			}
			else{
				if(res.update== 'Y' || res.update== 'y') {
					console.log('Buen trabajo. Éstas son las tareas que puedes ejecutar para realizar una maquetación independiente del desarrollo .\n gulp download (seleccion del layout)\n gulp sourcejs (solo para componentes)\n gulp jsfull (concatenado y minificado todo)\n gulp styles-css (compilado scss y escucha)\n gulp styles-min (compilado y minificado todo)\n gulp jade-comp (compilado jade)\n gulp cjj-min (compilar styles-min, jade-comp, jsfull)\n gulp cjj (compilar styles-min, jade-comp, sourcejs)\n gulp css-jade (compilar styles-min y jade-comp)\n gulp css-js (compilar styles-min y sourcejs)\n gulp jade-js (compilar jade-comp y sourcejs)\n gulp css (compilar solo css minificado con escucha)\n gulp js (compilar solo js minificado con escucha)\n gulp jade (compilar solo jade con escucha)\n gulp prod (compilar todo para exportar, no terminado)\n gulp layout (añadir una nueva plantilla a nuestro tema, copiado del repositorio)\n gulp component (añadir un nuevo componente)\n');
				}
				else{
					console.log('Inténtalo otra vez. :)');
				}
			}
	}));
});
//PRIMERO ACTUALIZAR VERSIONES DE LOS PAQUETES. npm-check-updates -ua
//	INICIAL. Después de hacer el npm install, ejecutar ésta tarea para selecciónar una plantilla y cabecera principal.
/*
*   Tarea de seleccion de layout
*/
//CONSOLA: 
//gulp download --layout layout-backend --index index-2 --header header-1 --head head-min --scripts --scripts-min --bootstrap mapfre --footer footer --fonts "fontawesome roboto" 
gulp.task('download', function(){
	
	gulp.src(['scss/**/*.scss'])
		.pipe(gulp.dest('./theme/scss'));
	gulp.src(['js/**/*.js'])
		.pipe(gulp.dest('./theme/js'));
	gulp.src(['gulpfile.js','gulpfile-wp.js', 'package.json'])
		.pipe(gulp.dest('./theme'));

	var fuentes= glob.sync(['fonts/*','!fonts/**/*.eot','!fonts/**/*.svg','!fonts/**/*.ttf','!fonts/**/*.woff','!fonts/**/*.woff2','!fonts/*.eot','!fonts/*.svg','!fonts/*.ttf','!fonts/*.woff','!fonts/*.woff2']);
	
	var plantillas= glob.sync(['jade/layout*.jade']);

	var index= glob.sync(['jade/index*.jade']);
	
	var heads= glob.sync(['jade/partials/head*.jade', '!jade/partials/header*.jade']);
	
	var headers= glob.sync(['jade/partials/header*.jade']);
	
	var footers = glob.sync(['jade/partials/footer*.jade']);
	
	var bootstrap= glob.sync(['bootstrap-css/*', '!bootstrap-css/**/*.css', '!bootstrap-css/**/*.json']);
	
	var scripts = glob.sync(['jade/partials/scripts*.jade']);
	
	gulp.src('*')
		.pipe(prompt.prompt({
			type: 'input',
			name: 'fonts',
			message: '\n¿Qué fuente desea descargar?\n'+fuentes
		}, function(res){
		
			if(res.fonts!=""){
				var arrayFont = res.fonts.split(" "); 
				for(var i in arrayFont){
					gulp.src(['fonts/'+arrayFont[i]+'/*'])
					.pipe(gulp.dest('./theme/fonts/'+arrayFont[i]));
				}
				gulp.src(['fonts/glyphicons-*'])
				.pipe(gulp.dest('./theme/fonts'));
			}
			else{
				gulp.src(['fonts/glyphicons-*'])
				.pipe(gulp.dest('./theme/fonts'));
			}
	})).pipe(prompt.prompt({
			type: 'input',
			name: 'layouts',
			message: '\n¿Qué plantillas desea descargar?\n'+plantillas
		}, function(res){
		
			if(res.layouts!=""){
				var arrayLayouts = res.layouts.split(" "); 
				for(var i in arrayLayouts){
					gulp.src(['jade/'+arrayLayouts[i]+'.jade'])
					.pipe(gulp.dest('./theme/jade'));
				}
			}
			else{
				gulp.src(['jade/layout.jade'])
				.pipe(gulp.dest('./theme/jade'));
				console.log('Se ha descargado el LAYOUT por defecto, (layout.jade)');
			}
	})).pipe(prompt.prompt({
			type: 'input',
			name: 'indexs',
			message: '\n¿Qué indexs desea descargar?\n'+index
		}, function(res){
		
			if(res.indexs!=""){
				var arrayIndexs = res.indexs.split(" "); 
				for(var i in arrayIndexs){
					gulp.src(['jade/'+arrayIndexs[i]+'.jade'])
					.pipe(gulp.dest('./theme/jade'));
				}
			}
			else{
				gulp.src(['jade/index.jade'])
				.pipe(gulp.dest('./theme/jade'));
				console.log('Se ha descargado el INDEX por defecto, (index.jade)');
			}
	})).pipe(prompt.prompt({
			type: 'input',
			name: 'heads',
			message: '\n¿Qué heads desea descargar?\n'+heads
		}, function(res){
		
			if(res.heads!=""){
				/*var arrayHeads = res.heads.split(" "); 
				for(var i in arrayHeads){
					gulp.src(['jade/partials/'+arrayHeads[i]+'.jade'])
					.pipe(gulp.dest('./theme/jade/partials'));
				}*/
				gulp.src(['jade/partials/'+res.heads+'.jade'])
					.pipe(rename('head.jade'))
					.pipe(gulp.dest('./theme/jade/partials'));
			}
			else{
				gulp.src(['jade/partials/head.jade'])
				.pipe(gulp.dest('./theme/jade/partials'));
				console.log('Se ha descargado el HEAD por defecto, sin concatenar bootstrap, (head.jade)');
			}
	})).pipe(prompt.prompt({
			type: 'input',
			name: 'headers',
			message: '\n¿Qué cabeceras desea descargar?\n'+headers
		}, function(res){
		
			if(res.headers!=""){
				var arrayHeaders = res.headers.split(" "); 
				for(var i in arrayHeaders){
					gulp.src(['jade/partials/'+arrayHeaders[i]+'.jade'])
					.pipe(gulp.dest('./theme/jade/partials'));
				}
			}
			else{
				gulp.src(['jade/partials/header.jade'])
				.pipe(gulp.dest('./theme/jade/partials'));
				console.log('Se ha descargado el HEADER por defecto, (header.jade)');
			}
	})).pipe(prompt.prompt({
			type: 'input',
			name: 'footers',
			message: '\n¿Qué footers desea descargar?\n'+footers
		}, function(res){
		
			if(res.footers!=""){
				var arrayFooters = res.footers.split(" "); 
				for(var i in arrayFooters){
					gulp.src(['jade/partials/'+arrayFooters[i]+'.jade'])
					.pipe(gulp.dest('./theme/jade/partials'));
				}
			}
			else{
				gulp.src(['jade/partials/footer.jade'])
				.pipe(gulp.dest('./theme/jade/partials'));
				console.log('Se ha descargado el FOOTER por defecto, (footer.jade)');
			}
	})).pipe(prompt.prompt({
			type: 'input',
			name: 'bootstrapcss',
			message: '\n¿Qué configuración de Bootstrap desea descargar?\n'+bootstrap
		}, function(res){
		
			if(res.bootstrapcss!=""){
				var arrayBootstrapcss = res.bootstrapcss.split(" "); 
				for(var i in arrayBootstrapcss){
					gulp.src(['bootstrap-css/'+arrayBootstrapcss[i]]+'/*.min.css')
					.pipe(gulp.dest('./theme/css'));
					if(arrayBootstrapcss[i]=='mapfre') {
						console.log('Se ha descargado el BOOTSTRAP configurado para Mapfre');
					}
				}
			}
			else{
				gulp.src(['bootstrap-css/general/*.min.css'])
				.pipe(gulp.dest('./theme/css'));
				console.log('Se ha descargado el BOOTSTRAP por defecto, (bootstrap.min.css v3.3.7)');
			}
	})).pipe(prompt.prompt({
			type: 'input',
			name: 'scriptsjs',
			message: '\n¿Desea descargar los scripts minificados o con las llamadas independientes?\n'+scripts
		}, function(res){
		
			if(res.scriptsjs!=""){
				var arrayScriptsjs = res.scriptsjs.split(" "); 
				for(var i in arrayScriptsjs){
					gulp.src(['jade/partials/'+arrayScriptsjs[i]]+'.jade')
					.pipe(gulp.dest('./theme/jade/partials'));
				}
			}
			else{
				gulp.src(['jade/partials/scripts.jade'])
				.pipe(gulp.dest('./theme/jade/partials'));
				console.log('Se han descargado los scripts con llamadas independientes. (jquery, bootstrap, components)');
			}
	}));
});


//	GESTIÓN de tareas por separado según necesidad
/*
*	Configuración de la tarea  'sourcejs' MINIFICADO carpeta SOURCE. SOLO COMPONENTES
*/
gulp.task('sourcejs', function () {
	return gulp.src(['js/components/*.js','js/source/main.js'])
	.pipe(concat('components.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('js'));
	//gulp.run('js');
});

/*
*	Configuración de la tarea  'jsfull' MINIFICADO TODO
*/
gulp.task('jsfull',['sourcejs'], function () {
	return gulp.src(['js/jquery-1.11.3.min.js', 'js/bootstrap.min.js', 'js/quagga.min.js','js/components.min.js'])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('js'));
});

/* 
*	Configuración de la tarea 'styles-css' COMPILADO SCSS
*/
gulp.task('styles-css', function () {
	return gulp.src('scss/main.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer())
	.pipe(concat('styles.css'))
	.pipe(gcmq())
	.pipe(gulp.dest('./css'));
});

/* 
*	Configuración de la tarea 'styles-min' MINIFICADO
*/
gulp.task('styles-min',['styles-css'], function () {
	 gulp.src(['css/bootstrap.min.css','css/styles.css'])
	.pipe(concat('styles-concat.css'))
	.pipe(minifyCss())
	.pipe(rename('styles.min.css'))
	.pipe(gulp.dest('css'));	
});

/*
*	Configuración de la tarea  'jade' COMPILADO
*/
gulp.task('jade-comp', function () {
	gulp.src(['jade/**/*.jade','!jade/layout*.jade','!jade/partials/*.jade','!jade/components/*.jade'])
	.pipe(jade({pretty:true}))
	.pipe(gulp.dest(''));
	//gulp.run('jade');
});

//	COMBINACIÓN DE TAREAS con escuchas
/*
*	SCSS-JADE-JS (todo minificado)
*/
gulp.task('cjj-min', ['styles-min','jade-comp','jsfull'], function(){
	gulp.watch('scss/**/*.scss', ['styles-min']);
	gulp.watch('jade/**/*.jade', ['jade-comp']);
	gulp.watch('js/source/main.js', ['jsfull']);
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });

  gulp.watch("css/*.css").on("change", browserSync.reload);
  gulp.watch("*.html").on("change", browserSync.reload);
  gulp.watch("js/*.js").on("change", browserSync.reload);
	
});
/*
*	SCSS-JADE-JS ( CSS minificado, JADE, JS genera components)
*/
gulp.task('cjj', ['styles-min','jade-comp','sourcejs'], function(){
	gulp.watch('scss/**/*.scss', ['styles-min']);
	gulp.watch('jade/**/*.jade', ['jade-comp']);
	gulp.watch('js/**/*.js', ['sourcejs']);
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });

  gulp.watch("css/*.css").on("change", browserSync.reload);
  gulp.watch("*.html").on("change", browserSync.reload);
  gulp.watch("js/*.js").on("change", browserSync.reload);
	
});


/*
*	SCSS-JADE
*/
gulp.task('css-jade', ['styles-min','jade-comp'], function(){
	gulp.watch('scss/**/*.scss', ['styles-min']);
	gulp.watch('jade/**/*.jade', ['jade-comp']);
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });

  gulp.watch("css/*.css").on("change", browserSync.reload);
  gulp.watch("*.html").on("change", browserSync.reload);
	
});
/*
*	SCSS-JS
*/
gulp.task('css-js', ['styles-min','sourcejs'], function(){
	gulp.watch('scss/**/*.scss', ['styles-min']);
	gulp.watch('js/**/*.js', ['sourcejs']);
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });

  	gulp.watch("css/*.css").on("change", browserSync.reload);
  	gulp.watch("js/*.js").on("change", browserSync.reload);
});
/*
*	JADE-JS
*/
gulp.task('jade-js', ['jade-comp','sourcejs'], function(){
	gulp.watch('jade/**/*.jade', ['jade-comp']);
	gulp.watch('js/**/*.js', ['sourcejs']);
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });

  	gulp.watch("js/*.js").on("change", browserSync.reload);
  	gulp.watch("*.html").on("change", browserSync.reload);
});


//	WATCH, tareas de escucha MINIFICADO
//	configure which files to watch and what tasks to use on file changes
gulp.task('css', ['styles-min'], function () {
  gulp.watch('scss/**/*.scss', ['styles-min']);
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });

  gulp.watch("css/*.css").on("change", browserSync.reload);
});

gulp.task('js', ['jsfull'], function () {
  gulp.watch('js/**/*.js', ['jsfull']);
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("js/*.js").on("change", browserSync.reload);
});
gulp.task('jade', ['jade-comp'], function () {
  gulp.watch('jade/**/*.jade', ['jade-comp']);
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("*.html").on("change", browserSync.reload);
});

/*
*	PRODUCCIÓN 
*/
gulp.task('prod', ['styles-css', 'styles-min', 'jsfull', 'jade-comp'], function () {});
//Éstas tareas se pueden ejecutar después de habernos descargado ya el tema y se encuentra fuera de la carpeta repositorio-maquetación
/*
*	Nueva plantilla del repositorio: Nueva plantilla del repositorio: gulp layout --layout layout-2 --index index-2
*/
gulp.task('layout', function(){
	gulp.src('../repositorio-maquetacion/jade/'+argv.layout+'.jade')
		.pipe(gulp.dest('jade'));
	gulp.src('../repositorio-maquetacion/jade/'+argv.index+'.jade')
		.pipe(gulp.dest('jade'));
});
/*
*	Añadir componente del repositorio: gulp component --component slider
*/
gulp.task('component', function(){
	gulp.src('../repositorio-maquetacion/components/'+argv.component+'/jade/*.jade')
		.pipe(gulp.dest('jade/components'));
	gulp.src('../repositorio-maquetacion/components/'+argv.component+'/js/*.js')
		.pipe(gulp.dest('js/components'));
	gulp.src('../repositorio-maquetacion/components/'+argv.component+'/scss/*.scss')
		.pipe(gulp.dest('scss/components'));
	gulp.src('../repositorio-maquetacion/components/'+argv.component+'/css/*.css')
		.pipe(gulp.dest('css/components'));
	gulp.src('../repositorio-maquetacion/components/'+argv.component+'/img/*')
		.pipe(gulp.dest('img'));
});

<h1>Gulp проект для frontend</h1>
<p>Качаем архив, распаковываем так, чтобы файл<strong> gulp.js </strong>был в одном каталоге с папкой<strong> essay</strong>.</p>
<p>Если не установлен gulp, то устанавливаем: открываем консоль в нашей папке (там, где лежит файл <strong>gulpfile.js</strong>) и пишем: <strong>npm i --global gulp</strong>. Дальше пишем <strong>npm i </strong>в трьох папках! В основной, в папке <strong>_email-tasks</strong> и <strong>_html-slicing-tasks </strong>(разделил проекты для удобства настроек).</p>
<h2>Задача на верстку</h2>
<p>Открываем папку <strong>_html-slicing-tasks/_tasks</strong>, там есть папка <strong>default</strong>. Копируем ее как шаблон и называем именем текущей задачи (например <strong>essay-000001</strong>).</p>
<p>Теперь вернемся к файлу <strong>gulpfile.js</strong> в <strong>_html-slicing-tasks</strong>- открываем и меняем самую первую переменную <strong>var folderName = 'essay-</strong><strong>000001</strong><strong>'</strong>; на свою.</p>
<p>Пишем в консоле <strong>gulp</strong> и верстаем :)</p>
<p>Когда всё готово -<strong> gulp build</strong> и получаем папку <strong>dist </strong>со всем необходимым.</p>
<h2>Задача на верстку email</h2>
<p>За основу взял https://github.com/dudeonthehorse/kilogram. Только немного почистил от лишнего и изменил less на sass. Пример, чтобы разобратся - прилагается.</p>
<p>Открываем папку _<strong>email-tasks/_tasks</strong>, там есть папка <strong>default</strong>. Копируем ее как шаблон и называем именем текущей задачи (например <strong>essay-000002</strong>).</p>
<p>Заходим в эту папку, пишем в консоле <strong>gulp</strong> и верстаем.</p>
<p>Конечный вариант в папке <strong>build</strong><strong> </strong>со всем необходимым.</p>
<h2>Задача на имплементацию</h2>
<p>Копируем содержимое папки <strong>dist</strong> в папку <strong>web</strong> вашего сайта. Всё подвязано именно к структуре из задачи на верстку, если папка стилей будет называться по другому, то работать не будет.</p>
<p>В <strong>gulpfile.js</strong> (в корне рядом с папкой <strong>essay</strong>) меняем первую переменную <strong>var folderName = 'superiorpapers.com';</strong> на свою.</p>
<p>Пишем в консоле <strong>gulp</strong> и имплементируем.</p>
<p>Перед началом можно сжать все картинки в проекте <strong>gulp images.</strong></p>
<p>Для всех <strong>.css</strong> файлов будет работать браузерсинк. Если работаете с папкой из верстки, то будет работать всё.</p>
<h3>Фичи:</h3>
<details>
<summary> Многа букаф! </summary>
	<ol>
		<li>В консоле после создания сервера можно увидеть 2 ссылки: Local и <strong>External</strong>. Используем вторую для теста на разных девайсах. При запуске локального сервера будет еще ссылка на тунель - можно показать например ПМ-у свою локальную работу.</li>
		<li>При запуске идет задача <strong>stylefmt</strong>, которая форматирует все файлы <strong>.scss</strong> в стандартный вид (файл .stylelintrc).</li>
		<li>При изменении файлов формата <strong>.php, .js, .tpl, .html</strong> автоматически происходит перезагрузка страницы.</li>
		<li><strong>Js</strong> файлы конкатенировать не получается, из-за постоянных ошибок, связаных с подключением разных версий jquery в калькуляторе например или других скриптов в середине страницы от модулей и приходится их раскидывать или отключать по одному, так что есть возможность только сжать файлы. Чтобы сжать <strong>js</strong> файл нужно в папку <strong>js </strong>создать папку <strong>source-js</strong> и закинуть нужный файл туда, рядом создастся папка <strong>minimized-js</strong> и внутри наш файл с суфиксом <strong>.min</strong>.</li>
		<li>Шрифты можно генерировать на сайте http://transfonter.org/ - файлы в папку <strong>fonts</strong>, а сгенерированный файл стилей поправить пути и скинуть в <strong>app/styles/partials/base/_fonts.scss</strong>. Примеры в default.</li>
		<li>При работе с .<strong>scss </strong>создаются <strong>sourcemaps</strong>.</li>
		<li>Добавляются префиксы, файлы кешируются (времени уходит намного меньше, чем при генерации всех <strong>.scss</strong>) и происходит <strong>injection</strong> стилей (на сайте они применяются сразу без перезагрузки страницы).</li>
		<li>Если в стилях были грубые ошибки, то файл сгенерирован не будет - поглядывайте в консоль. Обычно там будет указан файл и место с ошибкой.</li>
		<li>Подключен плагин <strong>animate.css</strong> - для нужного класса пишем <strong>@include bounce;</strong> и будет сгенерирована анимация с кейфреймами только для этого эффекта, ничего лишнего!</li>
		<li>Подключена сетка <strong>Susy</strong>. Настройки в переменной <strong>$susy</strong> в <strong>app/styles/partials/vars/_vars.scss</strong>. Коротко - для враппера пишем <strong>@include container;</strong>, а для блоков количество колонок <strong>@include span(12);</strong>. В инете можно почитать подробней.</li>
		<li>Дальше работа с сассом - миксины, переменные и тд, кто что хочет. Если не хочет - пишет простой цсс в файле .scss и не заморачивается :)</li>
		<li>При добавлении картинок в папку <strong>app/images/sprite-items</strong> сгенерируется спрайт <strong>sprite.png</strong> в папке <strong>images</strong> и создастся файл <strong>_sprite.scss</strong> в папке с миксинами. Теперь можно в наших файлах инклудить спрайты через <strong>@include sprite($img_name)</strong>.</li>
		<li>Т.к. таск с обработкой картинок самый затратный по времени, то он запускается отдельно или при билде. Можно запустить <strong>gulp images</strong> - сжатые файлы появятся в папке <strong>dist/images</strong>. Или же просто в конце работы запустить <strong>gulp build</strong> - ваш готовый проект будет создан в папке <strong>dist</strong>.</li>
		<li>Если что-то не меняется - попробуйте запустить <strong>gulp clear-cache</strong></li>
	</ol>
</details>
<h3>Вопросы, пожелания, критика, советы, донат и плюсики в карму - приветствуются :)</h3>

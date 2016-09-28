<h1>Gulp проект для frontend</h1>
<p>Качаем архив, распаковываем в папку на уровень выше от папки <strong>essay</strong>.</p>
<p>Если не установлен gulp, то устанавливаем: открываем консоль в нашей папке (там, где лежит файл <strong>gulpfile.js</strong>) и пишем: <strong>npm i --global gulp</strong>. Консоль не закрываем.</p>
<h2>Задача на верстку</h2>
<p>Открываем папку <strong>static-projects</strong>, там есть папка <strong>default</strong>. Копируем ее и называем именем текущей задачи (например название сайта)</p>
<p>Теперь вернемся к файлу <strong>gulpfile.js</strong> - открываем и меняем пути на свои в разделе <strong>PATH</strong> (пример в комментариях).</p>
<p>Дальше проверяем, чтобы в <strong>default</strong> таске стоял <strong>static-server</strong>.</p>
<p>Пишем в консоле <strong>gulp</strong> и верстаем :)</p>
<h2>Задача на имплементацию</h2>
<p>Копируем содержимое папки <strong>dist</strong> в папку <strong>web</strong> вашего сайта.</p>
<p>В <strong>gulpfile.js</strong> меняем пути на свои в разделе <strong>PATH</strong> (пример в комментариях).</p>
<p>Проверяем, чтобы в <strong>default</strong> таске стоял <strong>local-server</strong>.</p>
<p>Пишем в консоле <strong>gulp</strong> и имплементируем :)</p>
<p>Перед началом можно сжать все картинки в проекте <strong>gulp images</strong></p>
<h3>Фичи:</h3>
<details>
<summary>Многа букаф!</summary>
<ol>
<li>В консоле после создания сервера можно увидеть 2 ссылки: Local и <strong>External</strong>. Используем вторую для теста на разных девайсах. При запуске локального сервера будет еще ссылка на тунель - можно показать например ПМ-у свою локальную работу.</li>
<li>При запуске идет задача <strong>stylefmt</strong>, которая форматирует все файлы <strong>.scss</strong> в стандартный вид (файл .stylelintrc).</li>
<li>При изменении файлов формата <strong>.php, .js, .tpl, .html</strong> автоматически происходит перезагрузка страницы.</li>
<li><strong>Js</strong> файлы конкатенировать не получается, из-за постоянных ошибок, связаных с подключением разных версий jquery в калькуляторе например или других скриптов в середине страницы от модулей и приходится их раскидывать или отключать по одному, так что есть возможность только сжать файлы. Для этого просто дописываем к текущему файлу расширение <strong>.source.js</strong> - это будет исходник в обычном виде, а рядом появится сжатый файл с первичным названием (чтобы не менять в шаблонах на .min.js)</li>
<li>Шрифты можно генерировать на сайте http://transfonter.org/ - файлы в папку <strong>fonts</strong>, а сгенерированный файл стилей поправить пути и скинуть в <strong>app/styles/partials/base/_fonts.scss</strong>. Примеры в default.</li>
<li>Теперь по стилям - файлы <strong>.css</strong> не берут никакого участия в действии! Так что называейте файлы только <strong>.scss</strong>. Проще всего это сделать обычным переименование. Причем после сохранения рядом автоматически сгенерируется минифицированный файл <strong>.css</strong> и <strong>.map</strong> в папке <strong>app/styles/sourcemaps</strong>.</li>
<li>Кроме того - при генерации <strong>.css</strong> файла добавляются префиксы, файлы кешируются (времени уходит намного меньше, чем при генерации всех <strong>.scss</strong>) и происходит <strong>injection</strong> стилей (на сайте они применяются сразу без перезагрузки страницы).</li>
<li>Если в стилях были грубые ошибки, то файл сгенерирован не будет - поглядывайте в консоль. Обычно там будет указан файл и место с ошибкой.</li>
<li>Подключен плагин <strong>animate.css</strong> - для нужного класса пишем <strong>@include bounce;</strong> и будет сгенерирована анимация с кейфреймами только для этого эффекта, ничего лишнего!</li>
<li>Подключена сетка <strong>Susy</strong>. Настройки в переменной <strong>$susy</strong> в <strong>app/styles/partials/vars/_vars.scss</strong>. Коротко - для враппера пишем <strong>@include container;</strong>, а для блоков количество колонок <strong>@include span(12);</strong>. В инете можно почитать подробней.</li>
<li>Дальше работа с сассом - миксины, переменные и тд, кто что хочет. Если не хочет - пишет простой цсс в файле .scss и не заморачивается :)</li>
<li>При добавлении картинок в папку <strong>app/images/sprites</strong> сгенерируется спрайт <strong>sprite.png</strong> в папке <strong>images</strong> и создастся файл <strong>_sprite.scss</strong> в папке с миксинами. Теперь можно в наших файлах инклудить спрайты через <strong>@include sprite($img_name)</strong>.</li>
<li>Т.к. таск с обработкой картинок самый затратный по времени, то он запускается отдельно или при билде. Можно запустить <strong>gulp images</strong> - сжатые файлы появятся в папке <strong>dist/images</strong>. Или же просто в конце работы запустить <strong>gulp build</strong> - ваш готовый проект будет создан в папке <strong>dist</strong>.</li>
<li>Если что-то не меняется - попробуйте запустить <strong>gulp clear-cache</strong></li>
</ol>
</details>
<h3>Структура папок и файлов</h3>
<details>
<summary>Многа букаф!</summary>
<strong>.gitignore</strong> - игноры гита, <strong>.stylelintrc</strong> - правила для стилей (отступы, табы и тд, за основу взят stylelint-config-standard), <strong>gulpfile.js</strong> - таски галпа, где мы меняем только пути и сервер, <strong>package.json</strong> - нод пакеты, <strong>README.md</strong> - это описание;<br>
<strong>static-projects</strong> - папка с статическими проэктами на верстку;<br>
<strong>static-projects/default</strong> - шаблон для работы, копируем, переименовываем и работаем в ней, лишнее при желании удаляем или добавляем, что нужно;<br>
<strong>static-projects/default/app</strong> - папка с рабочей версией задачи;<br>
<strong>static-projects/default/dist</strong> - готовый проект;<br>
<strong>static-projects/default/app/fonts</strong> - сконверченные шрифты;<br>
<strong>static-projects/default/app/images</strong> - все фотки;<br>
<strong>static-projects/default/app/images/sprites</strong> - иконки и кнопки, которые можно заспрайтить, аккуратно с названиями, чтобы не создать конфликты с переменными, не начинать с цифры и без пробелом;<br>
<strong>static-projects/default/app/js</strong> - скрипты, сторонние библиотеки можно группировать по папкам, минификация будет работать и в подкаталогах;<br>
<strong>static-projects/default/app/styles</strong> - папка стилей;<br>
<strong>static-projects/default/app/styles/main.scss</strong> - основной файл для компиляции, в нем подключаем партиалы или удаляем при желании лишние (хотя ничего лишнего, кроме ресета не скомпилится с текущими настройками);<br>
<strong>static-projects/default/app/styles/main.css</strong> - скомпиленный файл стилей, минифицированный и готовый для подключения в html файл;<br>
<strong>static-projects/default/app/styles/sourcemaps</strong> - сорсы для дебагинга стилей, работает не точно из-за префиксов и из-за вложенностей, но показывает файл, где нужный нам код;<br>
<strong>static-projects/default/app/styles/partials</strong> - партиалы, файлы вида _*.scss, которые не компилятся, а только инклудятся в main.scss;<br>
<strong>static-projects/default/app/styles/partials/base:</strong><br>
<strong>_fonts.scss</strong> - копируем содержимое сконверченного файлы и правим пути;<br>
<strong>_header.scss, _footer.scss, _sidebar.scss, _main.scss</strong> - основные блоки страниц, удобно переносить частями (футер+шапка, потом остальное);<br>
<strong>static-projects/default/app/styles/partials/media-queries</strong> - медиа запросы для адаптации;<br>
<strong>static-projects/default/app/styles/partials/mixins</strong> - _mixins.scss - ваши миксины, _sprite.scss - файл спрайтов (генерируется автоматически), scss.template.handlebars - настройки для шаблона спрайта (не удалять);<br>
<strong>static-projects/default/app/styles/partials/plugins</strong> - сторонние плагины, переименовываем .css на _*.scss и подключаем в main.scss, там же уже есть плагин для миксин animate.css, возможно список будет пополнятся полезными плагинами с их описанием;<br>
<strong>static-projects/default/app/styles/partials/reset</strong> - обнуление стилей;<br>
<strong>static-projects/default/app/styles/partials/vars</strong> - переменные, если нужны + Susy;</p>
</details>

<h3>Вопросы, пожелания, критика, советы, донат и плюсики в карму - приветствуются :)</h3>

<h2>Бонус! Добавил проект для верстки емейлов в папку <strong>static-projects/emails</strong></h2>
<p>Особо не заморачивался сам, а взял готовое решение https://github.com/dudeonthehorse/kilogram.</p>
<p>Установка проще некуда - в папке емейлс <strong>npm i</strong>, дальше идем в папку <strong>projects</strong>, копируем <strong>default</strong>, переименовываем и в этой папке запускаем в консоле <strong>gulp</strong>. Написано на less, но переменные можно почистить и просто сверстать в base.less как обычном .css. Дальше разберетесь)</p>

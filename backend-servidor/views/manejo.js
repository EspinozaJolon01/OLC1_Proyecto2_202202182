function agregarPestana() {
    var tabContainer = document.getElementById('tab-container');
    var numTabs = tabContainer.querySelectorAll('.tab').length + 1;
    var newTab = document.createElement('div');
    newTab.setAttribute('id', 'tab' + numTabs);
    newTab.classList.add('tab');

    var newTabContent = `
        <a href="#tab${numTabs}">Pestaña ${numTabs}</a>
        <div class="tab-content">
            <h2>Editor</h2>
            <div class="editor">
                <textarea class="code-editor" placeholder="Escribe tu código aquí..." style="height: 300px;"></textarea>
            </div>
        </div>
    `;

    newTab.innerHTML = newTabContent;
    tabContainer.appendChild(newTab);
}


function arbirArchivos(){
    console.log("vamos abrir nuevos archviso")
}

function guardarArchivos(){
    console.log("vamos a guardar")
}

function ejecutar(){
    console.log("vamos a ejecutar")
}


function reportes(){
    console.log("vamos a ver reportes")
}
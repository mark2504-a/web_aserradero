(function () {
    'use strict';

    var grid = document.getElementById('catalogo-grid');
    if (!grid) return;

    var row = grid.querySelector('.row');
    if (!row) return;

    var items = Array.prototype.slice.call(row.children);
    var totalCount = items.length;

    var searchInput = document.getElementById('buscador-producto');
    var categoryButtons = Array.prototype.slice.call(document.querySelectorAll('.chip-categoria'));
    var sortSelect = document.getElementById('orden-productos');
    var counter = document.getElementById('catalogo-contador');
    var noResults = document.getElementById('catalogo-sin-resultados');

    var currentCategory = 'todos';

    function normalizar(texto) {
        return (texto || '')
            .toString()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .toLowerCase()
            .trim();
    }

    function aplicarFiltro() {
        var termino = normalizar(searchInput ? searchInput.value : '');
        var visibles = 0;

        items.forEach(function (item) {
            var categoria = item.getAttribute('data-categoria');
            var nombre = normalizar(item.getAttribute('data-nombre'));
            var coincideCategoria = currentCategory === 'todos' || categoria === currentCategory;
            var coincideBusqueda = termino === '' || nombre.indexOf(termino) !== -1;
            var visible = coincideCategoria && coincideBusqueda;

            item.style.display = visible ? '' : 'none';
            if (visible) visibles++;
        });

        if (counter) {
            counter.textContent = 'Mostrando ' + visibles + ' de ' + totalCount + ' productos';
        }

        if (noResults) {
            noResults.style.display = visibles === 0 ? '' : 'none';
        }
    }

    function ordenar(criterio) {
        var ordenados = items.slice();

        if (criterio === 'az') {
            ordenados.sort(function (a, b) {
                return normalizar(a.getAttribute('data-nombre')).localeCompare(normalizar(b.getAttribute('data-nombre')));
            });
        } else if (criterio === 'za') {
            ordenados.sort(function (a, b) {
                return normalizar(b.getAttribute('data-nombre')).localeCompare(normalizar(a.getAttribute('data-nombre')));
            });
        }

        ordenados.forEach(function (item) {
            row.appendChild(item);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', aplicarFiltro);
    }

    categoryButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            categoryButtons.forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-categoria');
            aplicarFiltro();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            ordenar(sortSelect.value);
            aplicarFiltro();
        });
    }

    aplicarFiltro();

    // ---- Panel de información al pasar el mouse / tocar la foto ----
    // Reutilizable: para agregar el panel a otro producto, agrega
    // data-medida, data-calidad y/o data-uso a su div de tarjeta (el
    // mismo que ya tiene data-categoria y data-nombre). Los tres son
    // independientes: si falta alguno, simplemente no se muestra esa
    // línea. El panel solo se activa si hay al menos data-calidad o
    // data-uso (data-medida por sí sola no activa el panel). Si un
    // producto no tiene ninguno, se comporta como antes (sin panel).
    function escaparHtml(texto) {
        var div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    var esTactil = window.matchMedia('(hover: none)').matches;

    items.forEach(function (item) {
        var medida = item.getAttribute('data-medida');
        var calidad = item.getAttribute('data-calidad');
        var uso = item.getAttribute('data-uso');
        if (!calidad && !uso) return;

        var singleProject = item.querySelector('.single-project');
        var projectImg = item.querySelector('.project-img');
        if (!singleProject || !projectImg) return;

        singleProject.classList.add('tiene-info-panel');

        var panel = document.createElement('div');
        panel.className = 'producto-info-panel';
        var panelHtml = '';
        if (medida) {
            panelHtml += '<div class="info-linea producto-info-medida"><i class="fa-solid fa-ruler"></i><span class="info-texto"><strong>Medida:</strong> <span class="valor">' + medida + '</span></span></div>';
        }
        if (calidad) {
            panelHtml += '<div class="info-linea producto-info-calidad"><i class="fa-solid fa-award"></i><span class="info-texto"><strong>Calidad:</strong> <span class="valor">' + escaparHtml(calidad) + '</span></span></div>';
        }
        if (uso) {
            panelHtml += '<div class="info-linea producto-info-uso"><i class="fa-solid fa-circle-check"></i><span class="info-texto"><strong>Ideal para:</strong> <span class="valor">' + escaparHtml(uso) + '</span></span></div>';
        }
        panel.innerHTML = panelHtml;
        projectImg.appendChild(panel);

        var toggleIcon = document.createElement('i');
        toggleIcon.className = 'fa-solid fa-circle-info producto-info-toggle';
        projectImg.appendChild(toggleIcon);

        if (esTactil) {
            projectImg.addEventListener('click', function () {
                projectImg.classList.toggle('mostrar-info');
            });
        }
    });
})();

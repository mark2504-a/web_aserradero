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
})();

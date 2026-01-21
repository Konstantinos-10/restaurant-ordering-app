import { menuArray } from './data.js';

const items = document.querySelector('.items')

function renderMenu() {
    let menuHtml = ''

    menuArray.forEach(function(menuItem) {
        menuHtml += `
        <div class="item">
            <div class="item-left-column">
                <div class="item-emoji">
                    <p>${menuItem.emoji}</p>
                </div>

                <div class="item-info">
                    <h2>${menuItem.name}</h2>
                    <p>${menuItem.description}</p>
                    <span class="price">$${menuItem.price}</span>
                </div>
            </div>

            <div class="add-item-button">
                <i class="fa-solid fa-plus"></i>
            </div>
        </div>`
    })

    items.innerHTML = menuHtml
}

renderMenu()
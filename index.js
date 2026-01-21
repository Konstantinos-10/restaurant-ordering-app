import { menuArray } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

// ==============================
// DOM refs (grab once, reuse)
// ==============================
const items = document.querySelector('.items')
const checkoutItemsList = document.querySelector('.checkout-items-list')
const checkoutTotalPrice = document.getElementById('checkout-total-price')

// ==============================
// Global click handler (event delegation)
// One listener handles both add + remove actions
// ==============================
document.addEventListener('click', (e) => {
    const { itemId, itemRemoveId } = e.target.dataset

    // Add item
    if (itemId) {
        toggleCheckoutSection()
        handleAddItemClick(itemId)
        return
    }

    // Remove item
    if (itemRemoveId) {
        handleRemoveItemClick(itemRemoveId)
    }
})

/**
 * Adds an item to the checkout list + updates total.
 * NOTE: itemId is a "mixed" string (menu id + uuid).
 * This code expects the real menu id to be the FIRST character (itemId[0]).
 */
function handleAddItemClick(itemId) {
    const itemRealId = itemId.split('-')[0]

    // Read current total from DOM (single source of truth in your current setup)
    let currentTotalPrice = Number(checkoutTotalPrice.innerHTML.replace('$', ''))

    menuArray.forEach((menuItem) => {
        if (menuItem.id == itemRealId) {
            // Update total
            currentTotalPrice += menuItem.price
            checkoutTotalPrice.innerHTML = `$${currentTotalPrice}`

            // Generate unique remove id so each line item can be removed individually
            const removeId = `${menuItem.id}-remove-${uuidv4()}`

            // Add item row to checkout list
            const itemHtml = `
                <div class="checkout-item">
                    <div class="checkout-item-details">
                        <span class="item-name">${menuItem.name}</span>
                        <button class="remove-item-button" data-item-remove-id="${removeId}">
                            Remove
                        </button>
                    </div>
                    
                    <div class="item-price">
                        <span>$${menuItem.price}</span>
                    </div>
                </div>
            `

            checkoutItemsList.innerHTML += itemHtml
        }
    })
}

/**
 * Removes a checkout line item + subtracts its price from total.
 * itemId format: "<realMenuId>-remove-<uuid>"
 */
function handleRemoveItemClick(itemId) {
    console.log('Removing item with id:', itemId)

    // Find the remove button (by its data attr), then remove the whole row
    const itemToRemove = document.querySelector(`[data-item-remove-id="${itemId}"]`)
    itemToRemove.parentElement.parentElement.remove()

    // Extract the real menu id (before the first "-")
    const itemRealId = itemId.split('-')[0]
    console.log(itemRealId)

    // Update total by looking up that menu item's price
    menuArray.forEach((menuItem) => {
        if (menuItem.id == itemRealId) {
            const currentTotal = Number(checkoutTotalPrice.innerHTML.replace('$', ''))
            checkoutTotalPrice.innerHTML = `$${currentTotal - menuItem.price}`
        }
    })
}

/**
 * Shows the checkout section the first time an item is added.
 * Keeps your exact behavior: only toggles if currently hidden.
 */
function toggleCheckoutSection() {
    const checkoutSection = document.querySelector('.checkout-section')

    if (checkoutSection.classList.contains('toggleDisplay')) {
        checkoutSection.classList.toggle('toggleDisplay')
    }
}

/**
 * Renders the menu list into the DOM.
 * Each "+" icon gets a mixed id (menuId + uuid) so the click can be uniquely identified.
 */
function renderMenu() {
    let menuHtml = ''

    menuArray.forEach((menuItem) => {
        menuHtml += `
            <div class="item">
                <div class="item-left-column">
                    <div class="item-emoji">
                        <p>${menuItem.emoji}</p>
                    </div>

                    <div class="item-info">
                        <h2>${menuItem.name}</h2>
                        <p>${menuItem.ingredients}</p>
                        <span class="price">$${menuItem.price}</span>
                    </div>
                </div>

                <div class="add-item-button">
                    <i class="fa-solid fa-plus" data-item-id="${menuItem.id}-add-${uuidv4()}"></i>
                </div>
            </div>
        `
    })

    items.innerHTML = menuHtml
}

// Initial render
renderMenu()

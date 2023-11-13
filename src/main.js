document.addEventListener("DOMContentLoaded", function () {
    var brandDropdown = document.getElementById("brand")
    var productTypeDropdown = document.getElementById("productType")
    var categoryDropdown = document.getElementById("category")
    var searchButton = document.getElementById("searchButton")
    var productList = document.querySelector(".product-list")

    fetch("http://makeup-api.herokuapp.com/api/v1/products.json")
        .then(function (response) {
            return response.json()
        })
        .then(function (data){
            var brands = []
            var productTypes = []
            var categories = []

            // Extract data dari API
            data.forEach(function (product) {
                var brand = (product.brand || '').toUpperCase()
                if (!brands.includes(brand)){
                    brands.push(brand)
                }
                if (!productTypes.includes(product.product_type)){
                    productTypes.push(product.product_type)
                }
                if (!categories.includes(product.category)){
                    categories.push(product.category)
                }
            })

            //brand dropdown
            brands.sort() //susun ikut alphabet order
            brands.forEach(function (brand) {
                var option = document.createElement("option");
                option.value = brand;
                option.textContent = brand;
                brandDropdown.appendChild(option);
            })

            //product type dropdown
            productTypes.forEach(function (type) {
                var option = document.createElement("option");
                option.value = type;
                option.textContent = type;
                productTypeDropdown.appendChild(option);
            })

            //category dropdown
            categories.forEach(function (category) {
                var option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categoryDropdown.appendChild(option);
            })            
            
            // Remove loading placeholders
            brandDropdown.querySelector('option[value=""]').remove()
            productTypeDropdown.querySelector('option[value=""]').remove()
            categoryDropdown.querySelector('option[value=""]').remove()
        })   

    // Create a popup for the product details
    var productDetailsPopup = document.createElement("div");
    productDetailsPopup.classList.add("product-details-popup");
    
    // Search button click event
    searchButton.addEventListener("click", function (){
        var selectedBrand = brandDropdown.value
        var selectedProductType = productTypeDropdown.value
        var selectedCategory = categoryDropdown.value
        var minPrice = document.getElementById("minPrice").value
        var maxPrice = document.getElementById("maxPrice").value
        var minRating = document.getElementById("minRating").value
        var maxRating = document.getElementById("maxRating").value
    
        productList.innerHTML = ""  // Clear previous search results


        var apiUrl = "http://makeup-api.herokuapp.com/api/v1/products.json?brand=" + selectedBrand + "&product_type=" + selectedProductType + "&product_category=" + selectedCategory
    
        // Add price filters
        if (minPrice) {
            apiUrl += "&price_greater_than=" + minPrice
        }
        if (maxPrice) {
            apiUrl += "&price_less_than=" + maxPrice
        }
    
        // Add rating filters
        if (minRating) {
            apiUrl += "&rating_greater_than=" + minRating
        }
        if (maxRating) {
            apiUrl += "&rating_less_than=" + maxRating
        }  

        fetch(apiUrl)
            .then(function (response) {
                return response.json()
            })
            .then(function (products) {
                // Display product information
                if (products.length > 0) {
                    products.forEach(function (product) {
                        var productItem = document.createElement("div")
                        productItem.classList.add("product-item")

                        // Check if the image_link is available
                        var imageSrc = product.image_link ? product.image_link : 'noimageavailable.png'
                        var imgElement = document.createElement("img")
                        imgElement.src = imageSrc
                        imgElement.alt = product.name

                        // Set error handler to display default image if the image link is error
                        imgElement.onerror = function() {
                            this.src = 'noimageavailable.png'
                        };

                        productItem.appendChild(imgElement);
                
                        var productInfo = document.createElement("div")
                        var priceSign = product.price_sign !== null ? product.price_sign : 'RM'

                        function generateRatingStars(rating) {
                            var maxRating = 5
                            var filledStars = '<span class="filled-star">&#9733;</span>' // Filled star
                            var emptyStars = '<span class="empty-star">&#9734;</span>' // Empty star
                            
                            var filledCount = Math.round(rating)
                            var emptyCount = maxRating - filledCount

                            return filledStars.repeat(filledCount) + emptyStars.repeat(emptyCount);
                        }

                        productInfo.innerHTML = `
                            <h2>${product.name}</h2>
                            <p>Price: ${priceSign}${parseFloat(product.price).toFixed(2)}</p>
                            <p>Rating: ${generateRatingStars(product.rating)}</p>
                            <p>Tag: ${product.product_type.toUpperCase()}</p>
                        `
                
                        productItem.appendChild(productInfo)
                        productItem.addEventListener("click", function () {
                            productDetailsPopup.innerHTML = "" // Clear previous popup content
    
                            // Display popup content
                            var popupContent = document.createElement("div");
                            popupContent.innerHTML = `
                                <p>${product.description}</p>
                                <p>Get more info about the product at <a href="${product.website_link}" target="_blank">${product.website_link}</a></p>
                                <button class="order-button" onclick="window.open('${product.product_link}', '_blank')">Order Now</button>
                            `

                            var closeButton = document.createElement("button")
                            closeButton.innerHTML = "&times;" //untuk logo 'x'
                            closeButton.classList.add("close-button") //supaya boleh apply css
                            closeButton.addEventListener("click", function () {
                                productDetailsPopup.style.display = "none"  // Hide popup when button is clicked

                            })
                            productDetailsPopup.appendChild(closeButton)
    
                            // Append the popup content to the popup
                            productDetailsPopup.appendChild(popupContent)
    
                            // Append the popup to the body
                            document.body.appendChild(productDetailsPopup)
                            productDetailsPopup.style.display = "block"
                        })   

                        productList.appendChild(productItem)
                    })
                } else {
                    productList.textContent = "No products found."
                }
            })
    })
})
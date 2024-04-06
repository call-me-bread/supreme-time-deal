package me.bread.supreme.integration.domain

import me.bread.supreme.integration.application.ProductType

class Product(
	var productType: ProductType,
	var name: String,
	var brandName: String,
	var description: String,
	var price: Money,
	var timeLimit: TimeLimit,
	var stock: Stock,
) {
	fun canBuy() {}

	fun choiceOption() {}
}

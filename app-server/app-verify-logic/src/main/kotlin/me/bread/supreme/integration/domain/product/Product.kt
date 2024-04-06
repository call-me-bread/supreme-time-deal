package me.bread.supreme.integration.domain.product

import me.bread.supreme.integration.domain.money.Money

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

package me.bread.supreme.integration.domain.product.entity

import me.bread.supreme.integration.domain.money.vo.Money
import me.bread.supreme.integration.domain.product.enums.ProductType
import me.bread.supreme.integration.domain.product.vo.Stock
import me.bread.supreme.integration.domain.product.vo.TimeLimit

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

package me.bread.supreme.integration.domain.order.entity

import me.bread.supreme.integration.domain.money.Money
import me.bread.supreme.integration.domain.order.vo.Address

/**
 * 배송에 대한 정책들이 담겨있다. 예를들어 배송 가격, 도서 산간 가격 등
 */
class Shipment(
	val shippingPrice: Money,
	val destination: Address
) {
	/**
	 * 도서 산간 지역 2000원 배송 추가 요금
	 */
	fun additionalShippingPrice(): Money {
		if (this.destination.isIsland()) {
			return Money.won(2000)
		}

		return Money.ZERO
	}
}

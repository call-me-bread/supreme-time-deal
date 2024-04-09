package me.bread.supreme.integration.domain.order.entity

import me.bread.supreme.integration.domain.accounts.entity.Accounts
import me.bread.supreme.integration.domain.order.enums.OrderStatus
import me.bread.supreme.integration.domain.order.vo.Address
import me.bread.supreme.integration.domain.product.entity.Product

class Order(
	val orderItem: MutableList<OrderItem>,
	val accounts: Accounts,
	var status: OrderStatus,
	val shipments: MutableList<Shipment>,
) {
	/**
	 * 주문 대기
	 *
	 * 주문에 필요한 조건들 검증 -> 주문 대기 상태 변경
	 */
	fun prepare(
		accounts: Accounts,
		product: Product,
		address: Address,
	) {
		// 구매 제한 시간 초과 됐는지 확인

		// 선착순 밀렸는지 확인

		// 핸드폰 인증 여부 확인

		// 상품 재고가 있는지 확인

		// 사용자 기본 주소 있는지 확인

		// 주문 대기 상태 변경
		this.status = OrderStatus.PENDING
	}

	fun timeOver() {}

	fun paymentMethod() {}

	fun options() {}

	fun deliveryFee() {}

	fun pay() {}

	fun appendAddress() {}

	fun appendPhoneNumber(number: String) {}

	fun invoice() {}
}

package me.bread.supreme.integration

import me.bread.supreme.integration.domain.accounts.entity.Authentication
import me.bread.supreme.integration.domain.accounts.vo.Email
import me.bread.supreme.integration.domain.accounts.vo.Password
import me.bread.supreme.integration.domain.accounts.vo.PhoneNumber
import me.bread.supreme.integration.domain.accounts.entity.Accounts
import me.bread.supreme.integration.domain.accounts.enums.Role
import me.bread.supreme.integration.domain.money.Money
import me.bread.supreme.integration.domain.order.vo.Address
import me.bread.supreme.integration.domain.product.entity.Product
import me.bread.supreme.integration.domain.product.entity.TimeLimit
import me.bread.supreme.integration.domain.product.enums.ProductType
import me.bread.supreme.integration.domain.product.vo.Stock
import java.math.BigDecimal
import java.time.LocalDateTime

object Fixtures {
	fun aCustomer(): Accounts {
		return Accounts(
			role = Role.USER,
			address = Address(
				city = "Vishterich",
				province = "maiestatis",
				detail = "Saint Vincent and the Grenadines"
			),
			authentication = Authentication(
				email = Email("octavio.daniel@example.com"),
				password = Password("interpretaris"),
				phoneNumber = PhoneNumber("010-363-4319"),
			)
		)
	}

	fun aTimeLimit(): TimeLimit {
		return TimeLimit(
			startTime = LocalDateTime.of(2024, 10, 1, 1, 0),
			endTime = LocalDateTime.of(2024, 10, 1, 1, 31),
		)
	}

	fun aProduct(name: String = "Galaxy 12"): Product {
		return Product(
			productType = ProductType.LIMIT,
			name = name,
			brandName = "Samsung",
			description = "A great phone",
			price = Money(BigDecimal.valueOf(10000L)),
			timeLimit = aTimeLimit(),
			stock = Stock(10, LocalDateTime.now().plusDays(10L))
		)

	}

	val aNow: LocalDateTime = LocalDateTime.of(2024, 10, 1, 1, 1)
	val aNowPlus30Min: LocalDateTime = LocalDateTime.of(2024, 10, 1, 1, 11)
}

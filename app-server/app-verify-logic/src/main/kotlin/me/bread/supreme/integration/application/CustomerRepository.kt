package me.bread.supreme.integration.application

import me.bread.supreme.integration.domain.Customer

interface CustomerRepository {
	fun save(customer: Customer): Customer
}

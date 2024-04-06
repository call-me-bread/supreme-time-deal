package me.bread.supreme.customer.storage

import me.bread.supreme.customer.domain.entity.Customer
import me.bread.supreme.customer.domain.repository.CustomerRepository
import org.springframework.data.jpa.repository.JpaRepository

interface JpaCustomerRepository : CustomerRepository, JpaRepository<Customer, Long> {
	override fun save(customer: Customer)
}

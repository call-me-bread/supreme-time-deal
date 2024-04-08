package me.bread.supreme.customer.application.implementation

import me.bread.supreme.customer.domain.entity.Customer
import me.bread.supreme.customer.domain.repository.CustomerRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class CustomerAppender(
	private val customerRepository: CustomerRepository,
) {
	@Transactional
	fun create(customer: Customer) {
		customerRepository.save(customer)
	}
}

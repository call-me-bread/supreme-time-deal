package me.bread.spreme.gateway.config

import org.springframework.cloud.client.loadbalancer.LoadBalanced
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.web.reactive.function.client.WebClient

@Configuration
@Profile("!dev")
class WebClientConfig {
	@Bean
	@LoadBalanced
	fun loadBalancedWebClientBuilder(): WebClient.Builder {
		return WebClient.builder()
	}
}

package me.bread.supreme.auth.config.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.http.HttpMethod.GET
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.server.SecurityWebFilterChain

@Configuration
@EnableWebFluxSecurity
class SecurityConfig(
	private val userDetailsService: CustomUserDetailsService,
) {
	@Bean
	fun passwordEncoder(): PasswordEncoder {
		return BCryptPasswordEncoder()
	}

	@Bean
	fun authenticationManager(): ReactiveAuthenticationManager {
		val authenticationManager = UserDetailsRepositoryReactiveAuthenticationManager(userDetailsService)
		authenticationManager.setPasswordEncoder(passwordEncoder())
		return authenticationManager
	}

	@Bean
	fun securityWebFilterChain(httpSecurity: ServerHttpSecurity): SecurityWebFilterChain {
		return httpSecurity
			.authorizeExchange {
				it.pathMatchers(GET, "/api/**").permitAll()
				it.pathMatchers(HttpMethod.GET, "/actuator/info/**").permitAll()
				it.pathMatchers(HttpMethod.POST, "/login").permitAll()
					.anyExchange().authenticated()
			}
			.csrf { it.disable() }
			.cors { it.disable() }
			.formLogin { it.disable() }
			.logout { it.disable() }
			.httpBasic { it.disable() }
			.build()
	}
}

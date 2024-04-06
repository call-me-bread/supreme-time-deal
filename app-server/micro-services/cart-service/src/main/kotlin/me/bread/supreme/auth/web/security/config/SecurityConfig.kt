package me.bread.supreme.auth.web.security.config

import me.bread.supreme.auth.web.security.filter.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.DefaultSecurityFilterChain
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter

@EnableWebSecurity
@Configuration
class SecurityConfig(
	private val jwtAuthenticationFilter: JwtAuthenticationFilter,
	private val entryPoint: AuthenticationEntryPoint,
) {
	private val allowedUris =
		arrayOf(
			"/v1/auth/login",
			"/v1/auth",
			"/v1/customer/register",
		)

	@Bean
	fun filterChain(http: HttpSecurity): DefaultSecurityFilterChain? {
		http.csrf { it.disable() }
			.headers { it.frameOptions { frameOptions -> frameOptions.sameOrigin() } }

		// restricts incoming urls
		http.authorizeHttpRequests {
			it.requestMatchers(*allowedUris).permitAll()
				.anyRequest().authenticated()
		}.sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }

		// setup authorization filter, exception handler
		http.addFilterBefore(jwtAuthenticationFilter, BasicAuthenticationFilter::class.java)
			.exceptionHandling { it.authenticationEntryPoint(entryPoint) }

		return http.build()
	}

	/**
	 * for removing default spring security password
	 * TODO. find better way
	 */
	@Bean
	fun userDetailsService(): UserDetailsService {
		return InMemoryUserDetailsManager()
	}

	@Bean
	fun passwordEncoder() = BCryptPasswordEncoder()
}

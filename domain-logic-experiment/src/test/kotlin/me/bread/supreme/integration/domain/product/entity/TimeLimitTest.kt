package me.bread.supreme.integration.domain.product.entity

import me.bread.supreme.integration.Fixtures.aNow
import me.bread.supreme.integration.Fixtures.aNowPlus30Min
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit.MINUTES

class TimeLimitTest {
	@Test
	fun `success when time over`() {
		// Given
		val startTime = aNow

		// When
		val sut = TimeLimit.create(startTime, startTime.plusMinutes(20L))
		sut.plusEndTime(30L, MINUTES)
		val endTimePlus1Minute = LocalDateTime.of(2024, 1, 1, 0, 51)

		// Then
		assertTrue(sut.timeOver(endTimePlus1Minute))
	}

	@Test
	fun `success when start time added`() {
		val originalStartTime = aNow
		val timeLimit = TimeLimit.create(originalStartTime, LocalDateTime.now().plusHours(1))

		val timeToAdd = 30L // 30분 추가
		timeLimit.plusStartTime(timeToAdd, MINUTES)

		assertTrue(timeLimit.startTime == originalStartTime.plus(timeToAdd, MINUTES)) // 시작 시간이 올바르게 추가되었는지 확인
	}

	@Test
	fun `success when end time added`() {
		// Given When
		val nowPlus30Min = TimeLimit.create(aNow, aNow.plusMinutes(10))

		// Then
		assertTrue(nowPlus30Min.endTime.isEqual(aNowPlus30Min))
	}
}

package me.bread.supreme.integration.database

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test

class InMemoryRdbTest {

	private lateinit var inMemoryRdb: InMemoryRdb

	@BeforeEach
	fun setUp() {
		inMemoryRdb = InMemoryRdb()
	}

	@Test
	@DisplayName("레코드 생성 테스트")
	fun `test createRecord`() {
		val record = inMemoryRdb.createRecord("Alice", 30)
		assertEquals("Alice", record.name)
		assertEquals(30, record.age)
	}

	@Test
	@DisplayName("ID로 레코드 조회 테스트")
	fun `test getRecordById`() {
		val record = inMemoryRdb.createRecord("Bob", 25)
		val retrievedRecord = inMemoryRdb.getRecordById(record.id)
		assertEquals(record, retrievedRecord)
	}

	@Test
	@DisplayName("모든 레코드 조회 테스트")
	fun `test getAllRecords`() {
		val record1 = inMemoryRdb.createRecord("Alice", 30)
		val record2 = inMemoryRdb.createRecord("Bob", 25)
		val allRecords = inMemoryRdb.getAllRecords()
		assertEquals(2, allRecords.size)
		assertEquals(listOf(record1, record2), allRecords)
	}

	@Test
	@DisplayName("레코드 수정 테스트")
	fun `test updateRecord`() {
		val record = inMemoryRdb.createRecord("Alice", 30)
		val updatedRecord = inMemoryRdb.updateRecord(record.id, "Alice Smith", 31)
		assertEquals("Alice Smith", updatedRecord?.name)
		assertEquals(31, updatedRecord?.age)
	}

	@Test
	@DisplayName("레코드 삭제 테스트")
	fun `test deleteRecord`() {
		val record = inMemoryRdb.createRecord("Alice", 30)
		val isDeleted = inMemoryRdb.deleteRecord(record.id)
		assertEquals(true, isDeleted)
		assertNull(inMemoryRdb.getRecordById(record.id))
	}
}

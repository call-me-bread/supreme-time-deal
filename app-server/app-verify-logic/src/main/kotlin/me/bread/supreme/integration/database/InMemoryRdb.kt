package me.bread.supreme.integration.database

import java.util.concurrent.ConcurrentHashMap


class InMemoryRdb {

	// 데이터 저장을 위한 ConcurrentHashMap
	private val database = ConcurrentHashMap<Long, Record>()

	// id를 관리하기 위한 AtomicInteger
	private val idGenerator = java.util.concurrent.atomic.AtomicLong()

	// 레코드 생성 및 저장 메서드
	fun createRecord(name: String, age: Int): Record {
		val id = idGenerator.incrementAndGet()
		val record = Record(id, name, age)
		database[id] = record
		return record
	}

	// id로 레코드 조회 메서드
	fun getRecordById(id: Long): Record? {
		return database[id]
	}

	// 모든 레코드 조회 메서드
	fun getAllRecords(): List<Record> {
		return database.values.toList()
	}

	// 레코드 수정 메서드
	fun updateRecord(id: Long, name: String, age: Int): Record? {
		if (database[id] != null) database[id] = Record(id, name, age)
		return database[id]
	}

	// 레코드 삭제 메서드
	fun deleteRecord(id: Long): Boolean {
		return database.remove(id) != null
	}

}


import { MongoClient } from 'mongodb'
import 'dotenv/config'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_event_hub'
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'campus_event_hub'

let client = null
let db = null
let isConnected = false
let isConnecting = false
let connectionError = null
let reconnectTimer = null

/**
 * Initialize connection to MongoDB (Compass / Local MongoDB Server)
 */
export async function initMongo() {
  if (isConnected && db) return db
  if (isConnecting) return null

  isConnecting = true
  connectionError = null

  try {
    console.log(`[MongoDB Compass] Connecting to ${MONGODB_URI}...`)
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    })

    await client.connect()
    db = client.db(MONGODB_DB_NAME)
    isConnected = true
    isConnecting = false
    console.log(`[MongoDB Compass] Connected successfully to database: "${MONGODB_DB_NAME}"`)

    // Clear reconnect timer if connected
    if (reconnectTimer) {
      clearInterval(reconnectTimer)
      reconnectTimer = null
    }

    return db
  } catch (err) {
    isConnected = false
    isConnecting = false
    connectionError = err.message
    console.warn(`[MongoDB Compass] Notice: MongoDB server not responding on 127.0.0.1:27017 (${err.message})`)
    console.warn(`[MongoDB Compass] The application will operate with in-memory persistence and auto-reconnect when MongoDB starts.`)

    // Start background polling to auto-connect as soon as user starts local MongoDB / Compass
    if (!reconnectTimer) {
      reconnectTimer = setInterval(async () => {
        try {
          if (!isConnected) {
            await initMongo()
          }
        } catch (_) {}
      }, 10000)
    }

    return null
  }
}

export function isMongoConnected() {
  return isConnected && db !== null
}

export function getDb() {
  return db
}

export function getCollection(name) {
  if (!isConnected || !db) return null
  return db.collection(name)
}

/**
 * Seed MongoDB collections from initial dataset if collections are empty.
 * This ensures that when the user opens MongoDB Compass, all collections are ready to inspect.
 */
export async function seedMongoIfEmpty(seedData) {
  if (!isConnected || !db) return false

  try {
    const collectionsToSeed = [
      { name: 'users', data: seedData.users },
      { name: 'events', data: seedData.events },
      { name: 'students', data: seedData.students },
      { name: 'permission_requests', data: seedData.permissionRequests },
      { name: 'od_records', data: seedData.odRecords },
      { name: 'registrations', data: seedData.registrations },
      { name: 'chapters', data: seedData.chapters },
      { name: 'campus_links', data: seedData.campusLinks },
      { name: 'notification_logs', data: seedData.notificationDispatches },
      { name: 'audit_logs', data: seedData.auditLogs },
      { name: 'system_settings', data: [seedData.systemSettings] }
    ]

    for (const col of collectionsToSeed) {
      if (!col.data || col.data.length === 0) continue
      const collection = db.collection(col.name)
      const count = await collection.countDocuments()

      if (count === 0) {
        // Prepare clean documents with string IDs
        const docs = col.data.map(item => {
          const doc = { ...item }
          if (doc.id && !doc._id) {
            doc._id = String(doc.id)
          }
          return doc
        })

        await collection.insertMany(docs)
        console.log(`[MongoDB Compass] Seeded collection "${col.name}" with ${docs.length} documents.`)
      }
    }

    // Create unique indexes
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true })
      await db.collection('events').createIndex({ id: 1 }, { unique: true, sparse: true })
      await db.collection('registrations').createIndex({ eventId: 1, email: 1 })
      await db.collection('permission_requests').createIndex({ id: 1 }, { unique: true, sparse: true })
      await db.collection('od_records').createIndex({ id: 1 }, { unique: true, sparse: true })
    } catch (idxErr) {
      // index might already exist
    }

    return true
  } catch (err) {
    console.error('[MongoDB Compass] Error seeding database:', err.message)
    return false
  }
}

/**
 * Read existing documents from MongoDB into memory if MongoDB has populated data.
 */
export async function syncFromMongo() {
  if (!isConnected || !db) return null

  try {
    const usersCount = await db.collection('users').countDocuments()
    if (usersCount === 0) return null // empty database, use initial seeds

    const [
      users,
      events,
      students,
      permissionRequests,
      odRecords,
      registrations,
      chapters,
      campusLinks,
      notificationDispatches,
      auditLogs,
      settingsDoc
    ] = await Promise.all([
      db.collection('users').find({}).toArray(),
      db.collection('events').find({}).toArray(),
      db.collection('students').find({}).toArray(),
      db.collection('permission_requests').find({}).toArray(),
      db.collection('od_records').find({}).toArray(),
      db.collection('registrations').find({}).toArray(),
      db.collection('chapters').find({}).toArray(),
      db.collection('campus_links').find({}).toArray(),
      db.collection('notification_logs').find({}).sort({ timestamp: -1 }).toArray(),
      db.collection('audit_logs').find({}).sort({ timestamp: -1 }).toArray(),
      db.collection('system_settings').findOne({})
    ])

    return {
      users,
      events,
      students,
      permissionRequests,
      odRecords,
      registrations,
      chapters,
      campusLinks,
      notificationDispatches,
      auditLogs,
      systemSettings: settingsDoc || null
    }
  } catch (err) {
    console.warn('[MongoDB Compass] Warning reading from Mongo:', err.message)
    return null
  }
}

/**
 * Asynchronously save or update a document in MongoDB Compass collection
 */
export async function saveToMongo(collectionName, query, doc, isInsert = false) {
  if (!isConnected || !db) return false

  try {
    const collection = db.collection(collectionName)
    const cleanDoc = { ...doc }
    if (cleanDoc.id && !cleanDoc._id) {
      cleanDoc._id = String(cleanDoc.id)
    }

    if (isInsert) {
      await collection.insertOne(cleanDoc)
    } else {
      await collection.updateOne(query, { $set: cleanDoc }, { upsert: true })
    }
    return true
  } catch (err) {
    console.error(`[MongoDB Compass] Error writing to ${collectionName}:`, err.message)
    return false
  }
}

/**
 * Asynchronously delete a document from MongoDB Compass collection
 */
export async function deleteFromMongo(collectionName, query) {
  if (!isConnected || !db) return false

  try {
    const collection = db.collection(collectionName)
    await collection.deleteOne(query)
    return true
  } catch (err) {
    console.error(`[MongoDB Compass] Error deleting from ${collectionName}:`, err.message)
    return false
  }
}

/**
 * Get real-time connection status and document counts for MongoDB Compass inspection
 */
export async function getMongoStatus() {
  const status = {
    connected: isConnected,
    uri: MONGODB_URI.replace(/:([^:@]+)@/, ':****@'), // scrub password if any
    dbName: MONGODB_DB_NAME,
    target: 'MongoDB Compass / Local MongoDB instance',
    port: 27017,
    lastChecked: new Date().toISOString(),
    error: connectionError,
    collections: {}
  }

  if (isConnected && db) {
    try {
      const collections = [
        'users',
        'events',
        'students',
        'permission_requests',
        'od_records',
        'registrations',
        'chapters',
        'campus_links',
        'notification_logs',
        'audit_logs'
      ]

      for (const name of collections) {
        status.collections[name] = await db.collection(name).countDocuments()
      }
    } catch (err) {
      status.error = err.message
    }
  }

  return status
}

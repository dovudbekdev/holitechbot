const { faker } = require("@faker-js/faker")
const ShortUniqueId = require("short-unique-id")
const { randomUUID } = new ShortUniqueId({ length: 10 })
const Subscription = require("../database/models/Subscription") 
const User = require("../database/models/User")

async function createFakeSubscriptions(num) {
    try {
        const fakeSubscriptions = []

        for (let i = 0; i < num; i++) {
            const userId = "1094968462" 
            const projectId = "9z6N6CBO2a" 
            const subscribedAt = faker.date.past().getTime() 
            const nextPaymentDate = faker.date.future().getTime() 
            const active = faker.datatype.boolean()
            const monthly = faker.datatype.boolean()
 
            fakeSubscriptions.push({
                userId,
                projectId,
                subscribedAt,
                nextPaymentDate,
                active,
                monthly,
            })
        }

        await Subscription.insertMany(fakeSubscriptions)
        console.log(`${num} fake subscriptions created successfully.`)
    } catch (error) {
        console.error("Error creating fake subscriptions:", error)
    }
}

// createFakeSubscriptions(1000) 

async function generateFakeUsers(count = 1) {
    const fakeUsers = []

    for (let i = 0; i < count; i++) {
        const fakeUser = new User({
            userId: faker.datatype.number(),
            id: randomUUID(),
            tgUserInfo: {
                id: faker.datatype.number(),
                is_bot: faker.datatype.boolean(),
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                language_code: faker.helpers.arrayElement(["uz", "ru", "en"]),
                username: faker.internet.userName(),
            },
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            phoneNumber: faker.phone.number(),
            isActive: faker.datatype.boolean(),
            projectId: "9z6N6CBO2a", // Yoki haqiqiy project ID-larni qo'llang
            paymentUserId: faker.datatype.uuid(),
            verifyCard: faker.datatype.boolean(),
        })

        fakeUsers.push(fakeUser)
    }

    try {
        await User.insertMany(fakeUsers)
        console.log(`${count} ta foydalanuvchi muvaffaqiyatli qo'shildi.`)
    } catch (error) {
        console.error("Foydalanuvchilarni qo'shishda xatolik:", error)
    }
}

// generateFakeUsers(100)


async function generateSubscriptionsForUsers() {
    try {
        // Barcha userlarni oling
        const users = await User.find()

        if (users.length === 0) {
            console.log("Hech qanday foydalanuvchi topilmadi.")
            return
        }

        const subscriptions = users.map((user) => {
            const currentTime = new Date().getTime()

            // 10 daqiqa (600000 millisekund) ichidagi tasodifiy vaqtni olish funksiyasi
            const getRandomTimeWithin10Minutes = (baseTime) => {
                const tenMinutesInMilliseconds = 10 * 60 * 1000
                const randomOffset = Math.floor(Math.random() * tenMinutesInMilliseconds)
                return baseTime - randomOffset
            } 

            // Tasodifiy o'tgan va kelajakdagi vaqtlar
            const subscribedAt = getRandomTimeWithin10Minutes(currentTime)
            const nextPaymentDate = getRandomTimeWithin10Minutes(subscribedAt)

            console.log(subscribedAt, nextPaymentDate)
            return new Subscription({  
                userId: user.userId, // User ID
                projectId: "9z6N6CBO2a", // Project ID'ni soxta yoki haqiqiy ID bilan almashtiring
                subscribedAt: subscribedAt,
                nextPaymentDate: nextPaymentDate,
                monthly: faker.datatype.boolean(), 
            })
        })

        // Subscriptionlarni bir necha yilda saqlang
        await Subscription.insertMany(subscriptions)
        console.log(`${subscriptions.length} ta subscription muvaffaqiyatli yaratildi.`)
    } catch (error) {
        console.error("Subscription yaratishda xatolik:", error)
    }
}

// generateSubscriptionsForUsers() 
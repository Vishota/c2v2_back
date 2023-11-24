import { giveAccess } from "../data/accountCourseAccess";
import { getCourse, setCourseAccessible } from "../data/courses";
import { pay } from "../data/wallets";

const depositMethods: {
    [name: string]: (walletId: number, amount: number, ...args: any) => Promise<boolean>
} = {
    freemoney: async (walletId: number, amount: number) => pay(walletId, amount, 'Free money for test')
}

export async function deposit(walletId: number, amount: number, methods: keyof typeof depositMethods) {
    return depositMethods[methods](walletId, amount);
}
export async function buyCourse(walletId: number, courseId: number) {
    const course = await getCourse(courseId, walletId)
    if (!course) throw 'course_does_not_exist'
    const payment = await pay(walletId, -course.price, '<' + courseId + '> course purchase', courseId)
    if (!payment) throw 'payment_not_success'
    return giveAccess(walletId, courseId, 'ADMIN')
}
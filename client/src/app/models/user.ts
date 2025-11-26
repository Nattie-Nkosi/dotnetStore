export interface Address {
	id?: number
	name: string
	line1: string
	line2?: string
	city: string
	state: string
	postal_code: string
	country: string
}

export interface User {
	email: string
	userName: string
	roles: string[]
}

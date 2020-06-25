export const parseCookie = (cookie: string) => {
	const arr = cookie.split('=')
	const chocoCookie = {
		[arr[0]]: arr[1]
	}
	return chocoCookie
}

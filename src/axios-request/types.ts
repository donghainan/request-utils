import { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
export namespace APIResponse {
	export type Response<T> = AxiosResponse<
		{ code: number; msg: string; data: T },
		any
	>
	export interface Headers extends InternalAxiosRequestConfig {
		jwt?: boolean
	}
}

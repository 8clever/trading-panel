import { ConfigProvider } from "antd";
import React from "react";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
	body {
		margin: 0
	}
`

export function Providers (props: { children?: React.ReactNode }) {
	return (
		<>
			<GlobalStyle />
			<ConfigProvider>
				{props.children}
			</ConfigProvider>
		</>
		
	)
}
import { SettingOutlined } from "@ant-design/icons"
import { Button, Flex, Layout, Space, Typography } from "antd"
import React from "react"
import styled from "styled-components"

const { Header, Content } = Layout

interface IProps {
	title: string;
	children?: React.ReactNode
	menu?: React.ReactNode
}

export function PageLayout (props: IProps) {
	return (
		<FullLayout>
			<Header>
				<Flex justify="space-between" align="center" style={{ height: "100%" }}>
					<Typography.Title ellipsis style={{ color: 'white', margin: 0 }} level={3}>
						{props.title}
					</Typography.Title>
					<Space>
						{props.menu}
					</Space>
				</Flex>
			</Header>
			<PadContent>
				{props.children}
			</PadContent>
		</FullLayout>
	)
}

const FullLayout = styled(Layout)`
	height: 100vh;
	overflow: auto;
`

const PadContent = styled(Content)`
	padding: 20px;
`
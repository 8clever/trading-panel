import { Flex, Layout, Space, Typography } from "antd"
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
			<Content>
				<BodyContent>
					{props.children}
				</BodyContent>
			</Content>
		</FullLayout>
	)
}

const FullLayout = styled(Layout)`
	height: 100vh;
	overflow: auto;
`

const BodyContent = styled.div`
	padding: 20px;
`
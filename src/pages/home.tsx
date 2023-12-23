import { Button, Flex, Form, Input, InputNumber } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, SettingOutlined } from '@ant-design/icons'
import React from "react";
import { PageLayout } from "@src/components/PageLayout";
import { Link } from "react-router-dom";

interface TradeFormOutput {
	symbol: string;
}

export function Home () {

	const formFinish = React.useCallback((value: TradeFormOutput) => {
		console.log(value)
	}, [])

	return (
		<PageLayout 
			title="Trading Panel" 
			menu={
				<Link to="/settings">
					<Button icon={<SettingOutlined />} />
				</Link>
			}>
			<Form onFinish={formFinish}>
				<Form.Item name={'symbol'}>
					<Input placeholder="Symbol" />
				</Form.Item>
				<Form.Item name="margin">
					<InputNumber placeholder="Margin" style={{ width: '100%'}} />
				</Form.Item>
				<Flex gap={8}>
					<Button block type="primary" icon={<ArrowUpOutlined />}>Open Long</Button>
					<Button block icon={<ArrowDownOutlined />}>Open Short</Button>
				</Flex>
			</Form>
		</PageLayout>
	)
}
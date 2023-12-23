import { PageLayout } from "@src/components/PageLayout";
import { Link } from "react-router-dom";
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons'
import { Button, Flex, Space, Table } from "antd";
import { ProviderModal } from "@src/components/ProviderModal";
import { useModal } from "@src/hooks/useModal";

export function Settings () {

	const provider = useModal();

	return (
		<PageLayout 
			title="Settings"
			menu={
				<Link to="/">
					<Button icon={<RollbackOutlined />} />
				</Link>
			}>
			<Space direction="vertical" style={{ width: "100%" }}>
				<Flex justify="end">
					<Button onClick={provider.openNew} icon={<PlusOutlined />}>Provider</Button>
				</Flex>
				<Table 

				/>
			</Space>
			<ProviderModal visible={provider.visible} toggle={provider.close} value={{}} />
		</PageLayout>
	)
}
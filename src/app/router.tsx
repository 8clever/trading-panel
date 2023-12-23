import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "@src/pages/home";
import { Settings } from "@src/pages/settings";

export function Router () {
	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</HashRouter>
	)
}
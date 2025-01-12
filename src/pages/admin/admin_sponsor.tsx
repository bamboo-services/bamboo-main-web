/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2016-NOW(至今) 筱锋
 * Author: 筱锋(https://www.x-lf.com)
 *
 * 本文件包含 XiaoMain 的源代码，该项目的所有源代码均遵循MIT开源许可证协议。
 * --------------------------------------------------------------------------------
 * 许可证声明：
 *
 * 版权所有 (c) 2016-2024 筱锋。保留所有权利。
 *
 * 本软件是“按原样”提供的，没有任何形式的明示或暗示的保证，包括但不限于
 * 对适销性、特定用途的适用性和非侵权性的暗示保证。在任何情况下，
 * 作者或版权持有人均不承担因软件或软件的使用或其他交易而产生的、
 * 由此引起的或以任何方式与此软件有关的任何索赔、损害或其他责任。
 *
 * 使用本软件即表示您了解此声明并同意其条款。
 *
 * 有关MIT许可证的更多信息，请查看项目根目录下的LICENSE文件或访问：
 * https://opensource.org/licenses/MIT
 * --------------------------------------------------------------------------------
 * 免责声明：
 *
 * 使用本软件的风险由用户自担。作者或版权持有人在法律允许的最大范围内，
 * 对因使用本软件内容而导致的任何直接或间接的损失不承担任何责任。
 * --------------------------------------------------------------------------------
 */

import {useSelector} from "react-redux";
import {SystemInfoEntity} from "../../models/entity/system_info_entity.ts";
import {
    Card,
    CardFooter,
    CardHeader,
    CardPreview,
    createTableColumn,
    DataGrid,
    DataGridBody,
    DataGridCell,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridRow,
    TableCellLayout,
    TableColumnDefinition,
    Toolbar,
    ToolbarButton
} from "@fluentui/react-components";
import {DocumentRegular, LinkFilled} from "@fluentui/react-icons";
import {useNavigate} from "react-router";
import {useEffect} from "react";
import defaultBackground from "../../assets/images/default-background.webp";
import {animated, useSprings} from "@react-spring/web";
import {DataGridItemModule} from "../../models/modules/data_grid_item_module.ts";

export function AdminSponsor({headerEmit, menuEmit}: Readonly<{
    headerEmit: (data: string) => void,
    menuEmit: (data: string) => void
}>) {
    const navigate = useNavigate();
    const webInfoStore = useSelector((state: { webInfo: SystemInfoEntity }) => state.webInfo);

    const items: DataGridItemModule[] = [
        {
            id: "1",
            sponsor: {label: "shiro's Alley", icon: <DocumentRegular/>},
            type: "支付宝",
            money: 100.20,
            lastUpdated: "2024-09-30 23:59:59",
        },
        {
            id: "2",
            sponsor: {label: "shiro's Alley", icon: <DocumentRegular/>},
            type: "支付宝",
            money: 10.20,
            lastUpdated: "2024-09-30 23:59:59",
        },
        {
            id: "3",
            sponsor: {label: "shiro's Alley", icon: <DocumentRegular/>},
            type: "支付宝",
            money: 100,
            lastUpdated: "2024-09-30 23:59:59",
        },
        {
            id: "4",
            sponsor: {label: "shiro's Alley", icon: <DocumentRegular/>},
            type: "支付宝",
            money: 23.22,
            lastUpdated: "2024-09-30 23:59:59",
        },
        {
            id: "5",
            sponsor: {label: "shiro's Alley", icon: <DocumentRegular/>},
            type: "微信",
            money: 100.20,
            lastUpdated: "2024-09-30 23:59:59",
        },
    ];

    const columns: TableColumnDefinition<DataGridItemModule>[] = [
        createTableColumn<DataGridItemModule>({
            columnId: "sponsor",
            compare: (a, b) => {
                return a.sponsor.label.localeCompare(b.sponsor.label);
            },
            renderHeaderCell: () => "赞助者",
            renderCell: (item) => {
                return (
                    <TableCellLayout media={item.sponsor.icon}>
                        {item.sponsor.label}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<DataGridItemModule>({
            columnId: "type",
            compare: (a, b) => {
                return a.type.localeCompare(b.type);
            },
            renderHeaderCell: () => "方式",
            renderCell: (item) => {
                return (
                    <TableCellLayout>
                        {item.type}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<DataGridItemModule>({
            columnId: "money",
            compare: (a, b) => {
                return a.money - b.money;
            },
            renderHeaderCell: () => "赞助金额",
            renderCell: (item) => {
                return (
                    <TableCellLayout>
                        ¥ {item.money}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<DataGridItemModule>({
            columnId: "lastUpdate",
            compare: (a, b) => {
                return a.lastUpdated.localeCompare(b.lastUpdated);
            },
            renderHeaderCell: () => "赞助金额",
            renderCell: (item) => {
                return item.lastUpdated;
            },
        }),
        createTableColumn<DataGridItemModule>({
            columnId: "operate",
            renderHeaderCell: () => "操作",
            renderCell: () => {
                return (
                    <TableCellLayout>
                        操作
                    </TableCellLayout>
                );
            },
        }),
    ];


    document.title = `赞助 | ${webInfoStore.site.site_name}`;

    useEffect(() => {
        headerEmit("赞助");
        menuEmit("sponsor");
    }, [headerEmit, menuEmit]);

    const [springs] = useSprings(2, (index: number) => ({
        opacity: 1,
        transform: "translateY(0)",
        from: {opacity: 0, transform: "translateY(20px)"},
        delay: index * 50,
        config: {tension: 170, friction: 26},
    }));

    return (
        <div className={"grid grid-cols-12 gap-3 border-t"}>
            <div className={"col-span-full border-b py-1"}>
                <Toolbar>
                    <ToolbarButton appearance={"primary"} icon={<LinkFilled fontSize={24}/>}
                                   onClick={() => navigate("/admin/link/add")}>
                        添加赞助
                    </ToolbarButton>
                </Toolbar>
            </div>
            <animated.div className={"col-span-full lg:col-span-9 grid"} style={springs[1]}>
                <DataGrid
                    items={items}
                    columns={columns}
                    sortable
                    selectionMode="multiselect"
                    getRowId={(item) => item.id}
                    focusMode="composite"
                    style={{minWidth: "550px"}}
                >
                    <DataGridHeader>
                        <DataGridRow
                            selectionCell={{
                                checkboxIndicator: {"aria-label": "Select all rows"},
                            }}
                        >
                            {({renderHeaderCell}) => (
                                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                            )}
                        </DataGridRow>
                    </DataGridHeader>
                    <DataGridBody<DataGridItemModule>>
                        {({item, rowId}) => (
                            <DataGridRow<DataGridItemModule>
                                key={rowId}
                                selectionCell={{
                                    checkboxIndicator: {"aria-label": "Select row"},
                                }}
                            >
                                {({renderCell}) => (
                                    <DataGridCell>{renderCell(item)}</DataGridCell>
                                )}
                            </DataGridRow>
                        )}
                    </DataGridBody>
                </DataGrid>
            </animated.div>
            <animated.div className={"lg:col-span-3 hidden lg:block"} style={springs[0]}>
                <Card className={"m-auto w-full shadow-md rounded-lg bg-white"}>
                    <CardPreview>
                        <img
                            className="object-cover w-full h-36"
                            src={defaultBackground}
                            alt="背景图"
                        />
                    </CardPreview>
                    <CardHeader
                        header={<div className="text-xl font-bold text-gray-800">赞助信息</div>}
                        description={<div className="text-sm text-gray-500">赞助统计信息</div>}
                    />
                    <CardFooter>
                        <div className={"grid gap-3 px-4 py-3"}>
                            s
                        </div>
                    </CardFooter>
                </Card>
            </animated.div>
        </div>
    );
}

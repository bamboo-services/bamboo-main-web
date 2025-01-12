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

import {
    DocumentPdfRegular,
    DocumentRegular,
    EditRegular,
    FolderRegular,
    OpenRegular,
    PeopleRegular,
    VideoRegular,
} from "@fluentui/react-icons";
import {
    Avatar,
    createTableColumn,
    DataGrid,
    DataGridBody,
    DataGridCell,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridRow,
    PresenceBadgeStatus,
    TableCellLayout,
    TableColumnDefinition,
} from "@fluentui/react-components";

export function Demo() {

    type FileCell = {
        label: string;
        icon: JSX.Element;
    };

    type LastUpdatedCell = {
        label: string;
        timestamp: number;
    };

    type LastUpdateCell = {
        label: string;
        icon: JSX.Element;
    };

    type AuthorCell = {
        label: string;
        status: PresenceBadgeStatus;
    };

    type Item = {
        file: FileCell;
        author: AuthorCell;
        lastUpdated: LastUpdatedCell;
        lastUpdate: LastUpdateCell;
    };

    const items: Item[] = [
        {
            file: {label: "Meeting notes", icon: <DocumentRegular/>},
            author: {label: "Max Mustermann", status: "available"},
            lastUpdated: {label: "7h ago", timestamp: 1},
            lastUpdate: {
                label: "You edited this",
                icon: <EditRegular/>,
            },
        },
        {
            file: {label: "Thursday presentation", icon: <FolderRegular/>},
            author: {label: "Erika Mustermann", status: "busy"},
            lastUpdated: {label: "Yesterday at 1:45 PM", timestamp: 2},
            lastUpdate: {
                label: "You recently opened this",
                icon: <OpenRegular/>,
            },
        },
        {
            file: {label: "Training recording", icon: <VideoRegular/>},
            author: {label: "John Doe", status: "away"},
            lastUpdated: {label: "Yesterday at 1:45 PM", timestamp: 2},
            lastUpdate: {
                label: "You recently opened this",
                icon: <OpenRegular/>,
            },
        },
        {
            file: {label: "Purchase order", icon: <DocumentPdfRegular/>},
            author: {label: "Jane Doe", status: "offline"},
            lastUpdated: {label: "Tue at 9:30 AM", timestamp: 3},
            lastUpdate: {
                label: "You shared this in a Teams chat",
                icon: <PeopleRegular/>,
            },
        },
    ];

    const columns: TableColumnDefinition<Item>[] = [
        createTableColumn<Item>({
            columnId: "file",
            compare: (a, b) => {
                return a.file.label.localeCompare(b.file.label);
            },
            renderHeaderCell: () => {
                return "File";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout media={item.file.icon}>
                        {item.file.label}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<Item>({
            columnId: "author",
            compare: (a, b) => {
                return a.author.label.localeCompare(b.author.label);
            },
            renderHeaderCell: () => {
                return "Author";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout
                        media={
                            <Avatar
                                aria-label={item.author.label}
                                name={item.author.label}
                                badge={{status: item.author.status}}
                            />
                        }
                    >
                        {item.author.label}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<Item>({
            columnId: "lastUpdated",
            compare: (a, b) => {
                return a.lastUpdated.timestamp - b.lastUpdated.timestamp;
            },
            renderHeaderCell: () => {
                return "Last updated";
            },

            renderCell: (item) => {
                return item.lastUpdated.label;
            },
        }),
        createTableColumn<Item>({
            columnId: "lastUpdate",
            compare: (a, b) => {
                return a.lastUpdate.label.localeCompare(b.lastUpdate.label);
            },
            renderHeaderCell: () => {
                return "Last update";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout media={item.lastUpdate.icon}>
                        {item.lastUpdate.label}
                    </TableCellLayout>
                );
            },
        }),
    ];

    return (
        <DataGrid
            items={items}
            columns={columns}
            sortable
            selectionMode="multiselect"
            getRowId={(item) => item.file.label}
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
            <DataGridBody<Item>>
                {({item, rowId}) => (
                    <DataGridRow<Item>
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
    );
}

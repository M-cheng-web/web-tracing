import React from "react";
import { Table } from "antd";

interface Props {
  data: any[];
  tableHeight?: string | number;
  config?: any[];
  renderers?: Record<string, (record: any, index: number) => React.ReactNode>;
}

const CTable: React.FC<Props> = ({
  data,
  tableHeight = 250,
  config = [],
  renderers = {},
}) => {
  const columns = config.map((item: any) => {
    if (item.prop === "operate") {
      return {
        title: item.label,
        key: item.prop,
        width: item.width,
        fixed: "right" as const,
        render: (_: any, record: any, index: number) => {
          if (renderers["operate"]) {
            return renderers["operate"](record, index);
          }
          return null;
        },
      };
    }

    return {
      title: item.label,
      dataIndex: item.prop,
      key: item.prop,
      width: item.width,
      ellipsis: true,
      render: (text: any, record: any, index: number) => {
        if (item.isTemplate && renderers[item.prop]) {
          return renderers[item.prop](record, index);
        }
        return text;
      },
    };
  });

  return (
    <div className="c-table">
      <Table
        dataSource={data}
        columns={columns}
        scroll={{ y: tableHeight }}
        pagination={false}
        rowKey={(_, index) => index?.toString() || ""}
        size="small"
        bordered
        className="custom-table"
      />
    </div>
  );
};

export default CTable;

import pandas as pd
import json

# Excelファイルの読み込み
file_path = 'exceldata/source.xlsx'  # ここにExcelファイルのパスを指定します
sheet_name = 'ADL自立 (食事②-1)'  # ここにシート名を指定します

# Excelファイルを読み込んでDataFrameに変換
df = pd.read_excel(file_path, sheet_name=sheet_name, header=None)

# DataFrameをJSON形式に変換
# JSON構造のカスタマイズが必要なら、to_dict()の引数を適宜変更します
data = df.to_dict(orient='split')

# 必要に応じて、データ構造を調整
json_data = {
    "chartData": {
        "data": data['data'],
        "clickableCells": []  # クリック可能なセルの情報は手動で追加するか、別の方法で取得
    }
}

# JSONデータをファイルに保存
json_file_path = 'output.json'  # 出力するJSONファイルのパスを指定
with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json.dump(json_data, json_file, ensure_ascii=False, indent=4)

print(f"JSONデータが{json_file_path}に保存されました。")

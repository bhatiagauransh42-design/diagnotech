import urllib.request
import json

for d in ['diabetes', 'cardiovascular']:
    url = f'http://127.0.0.1:8000/api/v1/analytics/comparison/{d}'
    with urllib.request.urlopen(url) as r:
        data = json.loads(r.read().decode())
        print(f'=== {d.upper()} ===')
        print('Evaluation Protocol:', data.get('evaluation_protocol', 'N/A'))
        print('Test Cohort:', data.get('test_cohort_size', 'N/A'))
        for m in data['models']:
            print(f"  {m['name']}: Acc={m['accuracy']}, Prec={m['precision']}, Recall={m['recall']}, F1={m['f1']}, AUC={m['roc_auc']}")

for d in ['diabetes', 'cardiovascular']:
    url = f'http://127.0.0.1:8000/api/v1/analytics/curves/{d}'
    with urllib.request.urlopen(url) as r:
        data = json.loads(r.read().decode())
        print(f'=== {d.upper()} CURVES ===')
        print('ROC AUC:', data['curves']['roc']['auc'])
        print('Top 3 Features:', data['global_importance'][:3])

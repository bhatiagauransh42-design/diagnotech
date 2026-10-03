import sys, time
def test(name, fn):
    t0 = time.time()
    print(f"Importing {name}...", flush=True)
    fn()
    print(f"  -> {name} took {time.time()-t0:.2f}s", flush=True)

test("os", lambda: __import__("os"))
test("joblib", lambda: __import__("joblib"))
test("numpy", lambda: __import__("numpy"))
test("sklearn", lambda: __import__("sklearn"))
test("xgboost", lambda: __import__("xgboost"))
test("shap", lambda: __import__("shap"))
print("ALL IMPORTS DONE!", flush=True)

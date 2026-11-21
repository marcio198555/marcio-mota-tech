# usage : python3 -I check_cands.py domaine1 domaine2 ...  -> new / known
import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from noel_lib import known, stem
S, E = known()
for d in sys.argv[1:]:
    print(d, "known" if stem(d) in S else "new")

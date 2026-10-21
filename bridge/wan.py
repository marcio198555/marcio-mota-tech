import json, os, sys, time, shutil, traceback
from gradio_client import Client, handle_file
jobs = json.load(open('bridge/wan_jobs.json'))
os.makedirs('out', exist_ok=True)
space = os.environ.get('WAN_SPACE', 'zerogpu-aoti/wan2-2-fp8da-aoti-faster')
try:
    c = Client(space)
    api = c.view_api(return_format='dict', print_info=False)
    eps = {k: [p.get('parameter_name') for p in v['parameters']] for k, v in api['named_endpoints'].items()}
    print('ENDPOINTS', json.dumps(eps))
except Exception as e:
    print('CLIENT ERROR', repr(e)); traceback.print_exc(); sys.exit(0)
ep = next((k for k, v in eps.items() if 'input_image' in v), None)
print('USING', ep)
for j in jobs:
    t = time.time()
    try:
        img = 'out/' + j['name'] + '_in.png'
        res = c.predict(input_image=handle_file(j['image']), prompt=j['prompt'], duration_seconds=j['dur'],
                        steps=j.get('steps', 6), seed=j['seed'], randomize_seed=False, api_name=ep)
        print('RESULT', j['name'], repr(res)[:500], round(time.time() - t, 1))
        v = res[0]
        path = v.get('video') if isinstance(v, dict) else v
        shutil.copy(path, 'out/' + j['name'] + '.mp4')
        print('SAVED', j['name'])
    except Exception as e:
        print('PREDICT ERROR', j['name'], repr(e)[:3000], round(time.time() - t, 1))

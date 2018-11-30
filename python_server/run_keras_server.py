# USAGE
# Start the server:
# 	python run_keras_server.py
# Submit a request via cURL:
# 	curl -X POST -F image=@dog.jpg 'http://localhost:5000/predict'
# Submita a request via Python:
#	python simple_request.py

# import the necessary packages
# from keras.applications import ResNet50
# from keras.preprocessing.image import img_to_array
# from keras.applications import imagenet_utils
# from PIL import Image
# import numpy as np
import flask
import io

# from sample_models import *
import scipy.io.wavfile as wav
from python_speech_features import mfcc
# import pickle
# from char_map import char_map, index_map

from flask_cors import CORS

import subprocess
import os
import json

# initialize our Flask application and the Keras model
app = flask.Flask(__name__)
model = None
mfcc_dim = 13
# CORS(app)
CORS(app, resources={r"*": {"origins": "*"}})

# return
@app.route("/prediction_python_mfcc", methods=["POST"])
def prediction_python_mfcc():
	# initialize the data dictionary that will be returned from the
	# view
	data = {"success": False}

	if flask.request.method == "POST":

		data_1 = flask.request.json
		wav_file_name = data_1.get('wav_file_name')

		dir_path = os.path.dirname(os.path.realpath(__file__))
		wav_file_path = dir_path+"/"+wav_file_name

		# get mfcc
		(rate, sig) = wav.read(wav_file_path)
		_feature = mfcc(sig, rate, numcep=mfcc_dim)

		level1 = list()
		for idx in range(len(_feature)):

			level0 = dict()
			_data1 = _feature[idx]

			level0['a1'] = _data1[0]
			level0['a2'] = _data1[1]
			level0['a3'] = _data1[2]
			level0['a4'] = _data1[3]
			level0['a5'] = _data1[4]
			level0['a6'] = _data1[5]
			level0['a7'] = _data1[6]
			level0['a8'] = _data1[7]
			level0['a9'] = _data1[8]
			level0['a10'] = _data1[9]
			level0['a11'] = _data1[10]
			level0['a12'] = _data1[11]
			level0['a13'] = _data1[12]

			level1.append(level0)

		data["mfcc"] = level1
		data["success"] = True

	# return the data dictionary as a JSON response
	return flask.jsonify(data)


@app.route("/prediction_meyda_cli_mfcc", methods=["POST"])
def prediction_meyda_cli_mfcc():
	# initialize the data dictionary that will be returned from the
	# view
	data = {"success": False}

	if flask.request.method == "POST":

		data_1 = flask.request.json
		wav_file_name = data_1.get('wav_file_name')

		dir_path = os.path.dirname(os.path.realpath(__file__))
		wav_file_path = dir_path+"/"+wav_file_name

		# convert webm into wav
		cmd = 'meyda ' + wav_file_path + ' mfcc'

		# subprocess.call(cmd, shell=True)
		proc = subprocess.Popen(['meyda', wav_file_path, 'mfcc'], stdout=subprocess.PIPE)
		output = str(proc.stdout.read()).strip()

		# process results
		arr1 = str(output).split("*********mfcc*********")
		str1 = arr1[1].strip()

		# arr2 = str1.split("\\n")
		arr2 = str1.split("\\n")

		level1 = list()
		for idx in range(len(arr2)):

			level0 = dict()
			_data1 = arr2[idx]

			if len(_data1) > 10:
				arr3 = _data1.split(",")
				level0['a1'] = arr3[0].strip()
				level0['a2'] = arr3[1].strip()
				level0['a3'] = arr3[2].strip()
				level0['a4'] = arr3[3].strip()
				level0['a5'] = arr3[4].strip()
				level0['a6'] = arr3[5].strip()
				level0['a7'] = arr3[6].strip()
				level0['a8'] = arr3[7].strip()
				level0['a9'] = arr3[8].strip()
				level0['a10'] = arr3[9].strip()
				level0['a11'] = arr3[10].strip()
				level0['a12'] = arr3[11].strip()
				level0['a13'] = arr3[12].strip()
				level1.append(level0)

		data["mfcc"] = level1
		data["success"] = True

	# return the data dictionary as a JSON response
	return flask.jsonify(data)


# if this is the main thread of execution first load the model and
# then start the server
if __name__ == "__main__":
	print(("* Loading Keras model and Flask starting server..."
		"please wait until server has fully started"))

	app.run(host='0.0.0.0', debug = False, threaded = False)

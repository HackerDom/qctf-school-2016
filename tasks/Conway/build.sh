#!/bin/bash

if [[ $# -ne 1 ]]; then
	echo Usage: $0 flag
	exit -1
fi

pushd life-gen
./life.rb -s $1 ../flag_writer.rle
popd

rle_converter/rle_converter.py --rle_to_bin flag_writer.rle flag_writer.bin &&
noise_generator/noise_generator.py flag_writer.bin game.bin &&
rle_converter/rle_converter.py --bin_to_rle game.bin flag_writer_with_noise.rle &&
echo Build success

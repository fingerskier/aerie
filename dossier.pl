# dossier library upsert function
# the input is a dot-delimited list of names (the path) and some text (data)
# the final thing in the list is either a name or line-number
# the next-to-last thing in the list is the file-name (default extension is .dat)
# the other stuff in the list is the path

sub MAIN($path, $data = "") {
	my @path = $path.split('.');

	my $line_number = @path.pop;

	my $filename = @path.pop ~ '.dat';

	my $directory = @path.join('\\');

	my $filepath = '.\\' ~ $directory ~ '\\' ~ $filename;


	if $data {
		# data given = upsert
		my $line:Str;

		my @lines = $filepath.IO.lines;
		@lines[$line_number] = $data;
		
		my $fh = open $filepath, :w;

		for @lines {
			$fh.print($_ ~ "\n");
		}

		$fh.close;

		say @path, ' updated';
	} else {
		# data not given = get
		my @lines = $filepath.IO.lines;

		say @lines[$line_number];
	};
}

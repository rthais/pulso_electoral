require "rubygems"
require "bundler/setup"

require "daemons"

discriminator = File.join(File.dirname(__FILE__), 'lib', 'discriminator.rb')

options = {
  :app_name => 'discriminator',
  :log_dir => '/var/log',
  :backtrace => true,
  :log_output => true
}


Daemons.run(discriminator, options)